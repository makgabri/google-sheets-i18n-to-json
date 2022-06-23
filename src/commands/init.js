const fs = require('fs');
const inquirer = require('inquirer');
const locales = require('i18n-locales');

const printer = require('../printer');
const { QUES, NOTIFY } = printer;
const { saveFile, checkGitignore, appendFile, checkConfig, checkToken } = require('../fileHandling');
const { getNewToken, createSpreadsheet, initializeSpreadsheetInfo, spreadSheetURL, getData } = require('../google/index');

const _checkGitIgnore = async () => {
    const git = await checkGitignore();
    if (git.hasGitignore) {
        if (!git.gitignoreHasToken) {
            appendFile({
                path: '.gitignore',
                data: '\ni18n_token.json\n',
                message: NOTIFY.gitignore_update
            });
        }
    } else {
        printer.warn(NOTIFY.gitignore_DNE);
    }
}

const _createConfig = async () => {
    const existingConfig = checkConfig();
    if (existingConfig.hasConfig) {
        if (existingConfig.valid) {
            printer.error(NOTIFY.config_exists);
            return false;
        } else {
            const reconfigure = await inquirer.prompt({
                name: 'value',
                message: printer.question(QUES.config_malformed),
                type: 'confirm'
            });
            if (!reconfigure.value) return false;
        }
    }

    const path_input_type = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.config_path),
        type: 'list',
        choices: [
            { name: "Select a directory", value: 'SELECT' },
            { name: "Type path", value: 'TYPE' },
            { name: "Use root path", value: 'ROOT' }
        ]
    });

    let config = {
        path: null,
        languages: [],
    }
    if (path_input_type.value == "TYPE") {
        const typedPath = await _typeDirectory();
        config.path = typedPath == './' ? '.' : typedPath;
    } else if (path_input_type.value == "ROOT") {
        config.path = '.';
    } else {
        const selectedPath = await _selectedPath(0);
        config.path = selectedPath == './' ? '.' : selectedPath;
    }
    // TODO: Create local list such that [...popularLocales, SEPERATOR, ...otherLocales]
    const selectedLanguages = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.config_languages),
        type: 'checkbox',
        choices: locales,
        pageSize: 20
    })
    config.languages = selectedLanguages.value;
    return config;
}

const _typeDirectory = async () => {
    const path_input = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.config_path_type),
        type: 'input'
    });
    if (fs.existsSync(path_input.value)) {
        // TODO: Improve this to include tree searching(e.g src/../node_modules should bypass this check)
        if (path_input.value == 'node_modules') {
            printer.error(NOTIFY.config_path_nm);
            return await _typeDirectory();
        }
        const stats = fs.statSync(path_input.value);
        if (stats.isDirectory()) {
            return path_input.value;
        } else {
            printer.error(NOTIFY.path_not_dir);
            return await _typeDirectory();
        }
    } else {
        printer.error(NOTIFY.path_not_found_retry);
        return await _typeDirectory();
    }
}

const _selectedPath = async (level, currPath) => {
    let dirList = fs.readdirSync(currPath || './', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name != 'node_modules')
        .map(dirent => { return { name: dirent.name, value: dirent.name, short: (currPath || './')+dirent.name } });
    dirList.push({ name: "Select this directory", value: "/0" });
    if (level > 0) dirList.push({ name: "Go Back", value: '/-1' })
    const selected_path_input = await inquirer.prompt({
        name: 'value',
        type: 'list',
        message: printer.question(QUES.config_path_select, { '%PATH%': currPath || './' }),
        choices: dirList
    });
    if (selected_path_input.value == "/0") {
        return currPath || './';
    } else if (selected_path_input.value == "/-1") {
        let splited = currPath.split('/');
        splited.pop();
        let newPath = splited.length == 1 ? null : splited.join('/');
        return await _selectedPath(level - 1, newPath);
    } else {
        return await _selectedPath(level + 1, (currPath || '.') + '/' + selected_path_input.value);
    }
}

const _checkToken = async (tokenPath) => {
    const token = checkToken(tokenPath);
    if (token.hasToken) {
        if (token.valid) {
            printer.inform(NOTIFY.token_exists);
        } else {
            const reconfigure = await inquirer.prompt({
                name: 'value',
                message: printer.question(QUES.token_malformed),
                type: 'confirm'
            });
            if (reconfigure.value) return await getNewToken(tokenPath);
        }
        return token.data;
    } else {
        printer.inform(NOTIFY.token_create);
        return await getNewToken(tokenPath);
    }
}

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
        default: 'Sheet1'
    });
    let newSpreadsheetData = await createSpreadsheet(spreadsheet_name.value, sheet_name.value, token);
    if (!newSpreadsheetData) return;
    config.spreadsheetId = newSpreadsheetData.spreadsheetId;
    config.sheetName = newSpreadsheetData.sheets[0]?.properties.title;

    return await initializeSpreadsheetInfo(config, token);
}

const _writeConfig = async (config) => {
    saveFile({
        path: 'i18n_config.json',
        data: JSON.stringify(config, null, 4),
        message: NOTIFY.config_create_success
    });
}

const init = async () => {
    printer.printWelcome();

    printer.inform(NOTIFY.config_check_exists);
    let config = await _createConfig();
    if (!config) return;

    printer.inform(NOTIFY.gitignore_check_exists);
    await _checkGitIgnore();

    printer.inform(NOTIFY.token_check_exists);
    let token = await _checkToken(config.path);
    if (!token) return;

    await _generateSpreadsheet(config, token);
    await _writeConfig(config);

    await getData(config, token);

    printer.inform(NOTIFY.spreadsheet_url_click);
    printer.url(spreadSheetURL(config.spreadsheetId));
    console.log("");
}

exports.command = 'init';
exports.desc = 'Initializes the configurations after answering several questions in a file named i18n_config.json. Command will also require writing permissions from google. This requires a token to be stored in i18n_token.json. Prior to running, we will ensure that this file is ignored in .gitignore.\n';
exports.builder = {};
exports.handler = (argv) => init(); // TODO: LOOK INTO --force option