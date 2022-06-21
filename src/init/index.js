const fs = require('fs');
const inquirer = require('inquirer');
const locales = require('i18n-locales');

const { printWelcome, status } = require('../helper');
const { saveFile, checkGitignore, appendFile, checkConfig } = require('../fileHandling');
const { getNewToken, createSpreadsheet, initializeSpreadsheetInfo, spreadSheetURL, getData } = require('../google/index');

const _checkGitIgnore = async () => {
    const git = await checkGitignore();
    if (git.hasGitignore) {
        if (!git.gitignoreHasToken) {
            appendFile({
                path: '.gitignore',
                data: '\ni18n_token.json\n',
                message: 'Updated .gitignore to include i18n_token.json.'
            });
        }
    } else {
        console.log(status("warn") + " .gitignore does not exists. Create one or check if this is a git repo.");
    }
}

const _createConfig = async () => {
    const existingConfig = checkConfig();
    if (existingConfig.hasConfig) {
        if (existingConfig.valid) {
            console.log(status("error") + " i18n_config.json exists. Delete file to init, edit file directly or add --force before init to execute this command.");
            return false;
        } else {
            const reconfigure = await inquirer.prompt({
                name: 'value',
                message: (status("question") + " i18n_config.json seems to be malformed, do you wish to reconfigure: "),
                type: 'confirm'
            });
            if (!reconfigure.value) return false;
        }
    }

    const path_input_type = await inquirer.prompt({
        name: 'value',
        message: (status("question") + " Where do you want to store files(i18n_token and i18n json objects)?"),
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
        config.path = typedPath;
    } else if (path_input_type.value == "ROOT") {
        config.path = './';
    } else {
        const selectedPath = await _selectedPath(0);
        config.path = selectedPath;
    }
    // TODO: Create local list such that [...popularLocales, SEPERATOR, ...otherLocales]
    const selectedLanguages = await inquirer.prompt({
        name: 'value',
        message: (status("question") + " Please selected the languages you would like to create i18n json objects(You can always add custom language keys after): "),
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
        message: (status("question") + " Please type in the path of the directory to store the files(e.g src/i18n): "),
        type: 'input'
    });
    if (fs.existsSync(path_input.value)) {
        if (path_input.value == 'node_modules') {
            console.log(status("error") + " You cannot save the files in node_modules. Please select a different folder.");
            return await _typeDirectory();
        }
        const stats = fs.statSync(path_input.value);
        if (stats.isDirectory()) {
            return path_input.value;
        } else {
            console.log(status("error") + " Path is not a directory. Please input a directory.");
            return await _typeDirectory();
        }
    } else {
        console.log(status("error") + " No path found. Please try to input the path again.");
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
        message: (status("question") + ` Please select a directory(Current directory is ${currPath || './'}): `),
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
    if (fs.existsSync(`${ tokenPath }/i18n_token.json`)) {
        console.log(status("info") + " i18n_token.json exists. run `google-sheet-i18n-to-json authorize` to re-create token if needed.");
    } else {
        console.log(status("info") + " i18n_token.json does not exists. Attempting to generate token.")
        await getNewToken(tokenPath);
    }
}

const _generateSpreadsheet = async (config) => {
    const spreadsheet_name = await inquirer.prompt({
        name: 'value',
        message: (status("question") + " Please type in the name of the spreadsheet you would like: "),
        type: 'input'
    });
    const sheet_name = await inquirer.prompt({
        name: 'value',
        message: (status("question") + " Please type in the name of the sheet you would like(e.g web, app e.t.c): "),
        type: 'input',
        default: 'Sheet1'
    });
    let newSpreadsheetData = await createSpreadsheet(spreadsheet_name.value, sheet_name.value, config);
    if (!newSpreadsheetData) return;
    config.spreadSheetId = newSpreadsheetData.spreadsheetId;
    config.sheetName = newSpreadsheetData.sheets[0]?.properties.title;

    return await initializeSpreadsheetInfo(newSpreadsheetData, config);
}

const _writeConfig = async (config) => {
    saveFile({
        path: 'i18n_config.json',
        data: JSON.stringify(config, null, 4),
        message: 'Config successfully generated, located at the root folder named i18n_config.json.'
    });
}

const init = async () => {
    printWelcome();

    console.log(status("info") + " Checking if i18n_config.json exists.");
    let config = await _createConfig();
    if (!config) return;

    console.log(status("info") + " Checking if .gitignore exists and adding i18n_token.json.");
    await _checkGitIgnore();

    console.log(status("info") + " Checking i18n_token.json.");
    await _checkToken(config.path);

    await _generateSpreadsheet(config);
    await _writeConfig(config);

    await getData(config);

    console.log(status("info") + " The following is the link to view the spreadsheet where you can edit i18n translations.");
    console.log(status('url') + ' ' + spreadSheetURL(config.spreadSheetId));
}

module.exports = {
    init,
    getNewToken
}