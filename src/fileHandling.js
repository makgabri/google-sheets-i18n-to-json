const fs = require('fs');
const { status } = require('./helper');

const saveFile = ({path, data, message}) => {
    try {
        fs.writeFileSync(path, data);
        console.log(status("info") + " " + message);
    } catch (err) {
        console.log(status('error') + " " + `Trying to save file (${path}) but got: ${err}`);
    }
}

const appendFile = ({path, data, message}) => {
    try {
        fs.appendFileSync(path, data);
        console.log(status("info") + " " + message);
    } catch (err) {
        console.log(status('error') + " " + `Trying to append to file (${path}) but got: ${err}`);
    }
}

const checkGitignore = async () => {
    const hasGitignore = fs.existsSync('.gitignore');
    let gitignoreHasToken = false;
    if (hasGitignore) {
        try {
            const contents = fs.readFileSync('.gitignore');
            gitignoreHasToken = contents.includes("\ni18n_token.json\n");
        } catch (err) {
            console.log(status('error') + " " + `Trying to read .gitignore but got: ${err}`);
        }
    }
    const result = {
        hasGitignore,
        gitignoreHasToken
    }
    return result;
}

const checkConfig = () => {
    const hasConfig = fs.existsSync('i18n_config.json');
    let valid = hasConfig;
    let data = null;
    if (hasConfig) {
        try {
            const contents = JSON.parse(fs.readFileSync('i18n_config.json'));
            if (!contents.path || (typeof contents.path != 'string')) valid = false;
            if (!contents.languages || Array.isArray(contents.languages)) valid = false;
            if (!contents.spreadSheetId || (typeof contents.spreadSheetId != 'string')) valid = false;
            if (!contents.sheetName || (typeof contents.sheetName != 'string')) valid = false;
            if (!fs.existsSync(contents.path)) valid = false;
            data = contents;
        } catch (err) {
            console.log(status('error') + " " + `Trying to read i18n_config.json but got: ${err}`);
        }
    }

    const result = {
        hasConfig,
        valid,
        data
    };
    return result;
}

const checkToken = (path) => {
    const hasToken = fs.existsSync(`${path}/i18n_token.json`);
    let valid = hasToken;
    let data = null;
    if (hasToken) {
        try {
            // TODO: CONTINUE HERE
            const contents = JSON.parse(fs.readFileSync('i18n_config.json'));
            if (!contents.path || (typeof contents.path != 'string')) valid = false;
            if (!contents.languages || Array.isArray(contents.languages)) valid = false;
            if (!contents.spreadSheetId || (typeof contents.spreadSheetId != 'string')) valid = false;
            if (!contents.sheetName || (typeof contents.sheetName != 'string')) valid = false;
            if (!fs.existsSync(contents.path)) valid = false;
            data = contents;
        } catch (err) {
            console.log(status('error') + " " + `Trying to read i18n_config.json but got: ${err}`);
        }
    }

    const result = {
        hasToken
    }
    return result;
}

module.exports = {
    saveFile,
    appendFile,
    checkGitignore,
    checkConfig,
    checkToken
}