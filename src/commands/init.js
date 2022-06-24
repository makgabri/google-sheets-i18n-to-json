const inquirer = require('inquirer');

const printer = require('../printer');
const { QUES, NOTIFY, TAGS } = printer;
const { createSpreadsheet, initializeSpreadsheetInfo, spreadSheetURL, getData } = require('../google/index');
const { verifyGitIgnore, createConfig, createToken, writeConfig, randomString } = require('./helpers/initHelpers');

const _generateSpreadsheet = async (config, token) => {
    const spreadsheet_name = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.spreadsheet_name),
        type: 'input'
    });
    const sheet_name = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.sheet_name),
        type: 'input',
        default: `Sheet-${randomString(4)}`
    });
    let newSpreadsheetData = await createSpreadsheet(spreadsheet_name.value, sheet_name.value, token);
    if (!newSpreadsheetData) return;
    config.spreadsheetId = newSpreadsheetData.spreadsheetId;
    config.sheetName = newSpreadsheetData.sheets[0]?.properties.title;

    return await initializeSpreadsheetInfo(config, token);
}

const init = async (force) => {
    printer.printWelcome();

    printer.inform(NOTIFY.config_check_exists);
    let config = await createConfig(force);
    if (!config) return;

    printer.inform(NOTIFY.gitignore_check_exists);
    await verifyGitIgnore();

    printer.inform(NOTIFY.token_check_exists);
    let token = await createToken(config.path, force);
    if (!token) return;

    await _generateSpreadsheet(config, token);
    await writeConfig(config);

    await getData(config, token);

    printer.inform(NOTIFY.spreadsheet_url_click);
    printer.url(TAGS.spreadsheet_url, spreadSheetURL(config.spreadsheetId));
    console.log("");
}

exports.command = 'init';
exports.desc = 'Initializes the configurations after answering several questions in a file named i18n_config.json. Command will also require writing permissions from google. This requires a token to be stored in i18n_token.json. Prior to running, we will ensure that this file is ignored in .gitignore.\n';
exports.builder = {
    force: {
        describe: 'Indicate whether to force init if config file found',
        type: 'boolean'
    }
};
exports.handler = (argv) => init(argv.force);