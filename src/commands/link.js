const inquirer = require('inquirer');

const { verifyGitIgnore, createConfig, createToken, retrieveSpreadsheet, writeConfig } = require('./helpers/initHelpers');

const { readAllData, getData, spreadSheetURL } = require('../google');
const printer = require('../printer');
const { sheets_v4 } = require('googleapis');
const { NOTIFY, QUES, TAGS } = printer;

/**
 * Gets the whole sheet
 * @param {sheets_v4.Schema$Spreadsheet} spreadsheet - spreadsheet info
 * @param {import('../fileHandling').Config} config - config contents
 * @param {import('../fileHandling').Token} token - token contetns
 */
const _selectSheet = async (spreadsheet, config) => {
    const sheet = await inquirer.prompt({
        name: 'properties',
        message: printer.question(QUES.config_select_sheet),
        type: 'list',
        choices: spreadsheet.sheets.map(sheet => { return {
            name: sheet.properties.title,
            value: { sheetId: sheet.properties.sheetId, sheetName: sheet.properties.title },
            short: sheet.properties.title
        }})
    });
    config.sheetName = sheet.properties.sheetName;
    config.sheetId = sheet.properties.sheetId;
}

/**
 * Gets data in sheet
 * @param {import('../fileHandling').Config} config - config contents
 * @param {import('../fileHandling').Token} token - token contents
 */
const _readSheet = async (config, token) => {
    const data = await readAllData(config, token);
    if (!data) return;

    const languages = data.values[0]?.slice(1);
    const languagesFound = await inquirer.prompt({
        name: 'confirm',
        message: printer.question(QUES.config_languages_found, {"%LANGS%": JSON.stringify(languages)}),
        type: 'confirm'
    });
    if (!languagesFound.confirm) return;
    config.languages = languages;
}

const link = async (force) => {
    printer.printWelcome();

    printer.inform(NOTIFY.config_check_exists);
    let config = await createConfig(force, true);
    if (!config) return;

    printer.inform(NOTIFY.gitignore_check_exists);
    await verifyGitIgnore();

    printer.inform(NOTIFY.token_check_exists);
    let token = await createToken(config.path, force);
    if (!token) return;

    const spreadsheet = await retrieveSpreadsheet(config, token)
    printer.inform(NOTIFY.config_found_by_id, { "%NAME%": spreadsheet.properties.title });
    await _selectSheet(spreadsheet, config);

    await _readSheet(config, token);
    await writeConfig(config);

    await getData(config, token);

    printer.inform(NOTIFY.spreadsheet_url_click);
    printer.url(TAGS.spreadsheet_url, spreadSheetURL(config.spreadsheetId));
    console.log("");
}

exports.command = 'link';
exports.desc = 'Initializes the configurations like init except you provide the google sheet id and select the sheet. Similarly you can pass --force to overwrite current i18n settings.\n';
exports.builder = {
    force: {
        describe: 'Indicate whether to force init if config file found',
        type: 'boolean'
    }
};
exports.handler = (argv) => link(argv.force);