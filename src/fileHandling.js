const fs = require('fs');
const { status } = require('./printer');

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
            if (!contents.languages || !Array.isArray(contents.languages)) valid = false;
            if (!contents.spreadsheetId || (typeof contents.spreadsheetId != 'string')) valid = false;
            if (!contents.sheetName || (typeof contents.sheetName != 'string')) valid = false;
            if (!fs.existsSync(contents.path)) valid = false;
            data = contents;
        } catch (err) {
            console.log(status('error') + " " + `Trying to read i18n_config.json but got: ${err}`);
            valid = false;
        }
    }

    const result = {
        hasConfig,
        valid,
        data
    };
    return result;
}

/**
 * Check if token exists
 * @param {string} location path of the token
 * @returns an object determining whether token exists, is valid and the contents.
 */
const checkToken = (location) => {
    const path = `${location}/i18n_token.json`;
    const hasToken = fs.existsSync(`${path}`);
    let valid = hasToken;
    let data = null;
    if (hasToken) {
        try {
            const contents = JSON.parse(fs.readFileSync(path));
            if (!contents.access_token || (typeof contents.access_token != 'string')) valid = false;
            if (!contents.refresh_token || (typeof contents.refresh_token != 'string')) valid = false;
            if (!contents.scope || (typeof contents.scope != 'string')) valid = false;
            if (!contents.token_type || (typeof contents.token_type != 'string')) valid = false;
            if (!contents.expiry_date || (typeof contents.expiry_date != 'number')) valid = false;
            if (!contents.createdOn || (typeof contents.createdOn != 'string')) valid = false;
            data = contents;
        } catch (err) {
            console.log(status('error') + " " + `Trying to read ${path} but got: ${err}`);
            valid = false;
        }
    }

    const result = {
        hasToken,
        valid,
        data
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