const inquirer = require('inquirer');

const { verifyGitIgnore, createConfig, createToken, writeConfig, retrieveSpreadsheet, randomString } = require('./helpers/initHelpers');

const { getSpreadsheet, readAllData, getData, spreadSheetURL, createSheet, initializeSpreadsheetInfo } = require('../google');
const printer = require('../printer');
const { NOTIFY, QUES, TAGS } = printer;

const _askSheetName = async (config) => {
    const sheet = await inquirer.prompt({
        name: 'name',
        message: printer.question(QUES.sheet_name),
        type: 'input',
        default: `Sheet-${randomString(4)}`
    });
    config.sheetName = sheet.name;
    return sheet.name;
}

const linkNew = async (force) => {
    printer.printWelcome();

    printer.inform(NOTIFY.config_check_exists);
    let config = await createConfig(force, false);
    if (!config) return;

    printer.inform(NOTIFY.gitignore_check_exists);
    await verifyGitIgnore();

    printer.inform(NOTIFY.token_check_exists);
    let token = await createToken(config.path, force);
    if (!token) return;

    const spreadsheet = await retrieveSpreadsheet(config, token)
    printer.inform(NOTIFY.config_found_by_id, { "%NAME%": spreadsheet.properties.title });

    const sheetName = await _askSheetName(config);
    await createSheet(sheetName, config, token);
    await initializeSpreadsheetInfo(config, token);
    await writeConfig(config);

    await getData(config, token);

    printer.inform(NOTIFY.spreadsheet_url_click);
    printer.url(TAGS.spreadsheet_url, spreadSheetURL(config.spreadsheetId));
    console.log("");
}

exports.command = 'link-new';
exports.desc = 'Initializes the configurations like init except you provide the google sheet id then provide new sheet name and select languages. Similarly you can pass --force to overwrite current i18n settings.\n';
exports.builder = {
    force: {
        describe: 'Indicate whether to force init if config file found',
        type: 'boolean'
    }
};
exports.handler = (argv) => linkNew(argv.force);