const fs = require('fs');
const inquirer = require('inquirer');
const locales = require('i18n-locales');

const printer = require('../../printer');
const { QUES, NOTIFY } = printer;
const { saveFile, checkGitignore, appendFile, checkConfig, checkToken } = require('../../fileHandling');
const { getNewToken, getSpreadsheet } = require('../../google/index');
const { sheets_v4 } = require('googleapis');

/**
 * Verifies git ignore exists and also adds i18n_token.json to make sure it isn't pushed to git since this token is a representation of a user.
 */
const verifyGitIgnore = async () => {
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

/**
 * Creates the configuration file
 * @param {boolean} force - whether to override current config
 * @param {boolean} isLinking - whether config is linking. Passing true will prompt user to select language.
 * @returns {import('../../fileHandling').Config} the config object
 */
const createConfig = async (force, isLinking) => {
    const existingConfig = checkConfig();
    if (existingConfig.hasConfig && !force) {
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
    if (!isLinking) {
        const selectedLanguages = await inquirer.prompt({
            name: 'value',
            message: printer.question(QUES.config_languages),
            type: 'checkbox',
            choices: locales,
            pageSize: 20
        })
        config.languages = selectedLanguages.value;
    }
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

/**
 * Creates a token and saves it
 * @param {string} tokenPath - path to token
 * @param {boolean} force - whether to overwrite current token
 * @returns {import('../../fileHandling').Token} token object
 */
const createToken = async (tokenPath, force) => {
    const token = checkToken(tokenPath);
    if (token.hasToken && !force) {
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

const _askSpreadsheetID = async () => {
    const googlesheet = await inquirer.prompt({
        name: 'id',
        message: printer.question(QUES.config_input_spreadsheetId),
        type: 'input'
    });

    if (googlesheet.id == "") {
        printer.error(NOTIFY.question_answer_empty);
        return await _askSpreadsheetID();
    }
    return googlesheet.id;
}

/**
 * Returns spreadsheet info after inputting spread sheet id
 * @param {import('../../fileHandling').Config} config - config contents
 * @param {import('../../fileHandling').Token} token - token contents 
 * @returns {sheets_v4.Schema$Spreadsheet} the spreadsheet info
 */
const retrieveSpreadsheet = async (config, token) => {
    const spreadsheetId = await _askSpreadsheetID();
    const spreadsheet = await getSpreadsheet(spreadsheetId, token);
    if (!spreadsheet) return await retrieveSpreadsheet(config, token);
    
    config.spreadsheetId = spreadsheetId;
    return spreadsheet;
}

/**
 * Creates a random string with length as specified
 * @param {number} length - length of random string
 * @returns {string} random string with length of length
 */
const randomString = (length) => {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * charsLength)];
    }
    return result;
}

/**
 * Saves i18n_config.json given the config
 * @param {import('../../fileHandling').Config} config - config contents
 */
const writeConfig = async (config) => {
    saveFile({
        path: 'i18n_config.json',
        data: JSON.stringify(config, null, 4),
        message: NOTIFY.config_create_success
    });
}

module.exports = {
    verifyGitIgnore,
    createConfig,
    createToken,
    retrieveSpreadsheet,
    writeConfig,
    randomString
}