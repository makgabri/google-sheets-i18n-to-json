const chalk = require('chalk');
const fs = require('fs');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

// const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/spreadsheet'});
// const service = google.sheets({version: 'v4', auth});

// const title = 'Hello Gabrian';

// const resource = {
//     properties: {
//         title,
//     },
// };

const _checkGitIgnore = async () => {
    const eligible = fs.existsSync('.gitignore');
    if (eligible) {
        console.log("has")
    } else {
        console.log(chalk.blue('[')+chalk.yellow('WARNING')+chalk.blue(']') + " .gitignore does not exists. Create one or check if this is a git repo.");
    }
}

const init = async () => {
    console.log(chalk.blueBright('==============================='));
    console.log(chalk.blue('    Welcome to GOOGLE     '));
    console.log(chalk.blue('    SHEETS I18N to JSON     '));
    console.log(chalk.blueBright('==============================='));
    console.log(chalk.blue('[INFO]') + " Checking if .gitignore exists and adding i18n_credentials.json.");
    _checkGitIgnore();
    // fs.writeFile('i18n_config.json', "Testing", () => {
    //     "great success"
    // });
    // try {
    //     const spreadsheet = await service.spreadsheets.create({
    //         resource,
    //         fields: 'spreadsheetId',
    //     });
    //     console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    //     return spreadsheet.data.spreadsheetId;
    // } catch (err) {
    //     // TODO (developer) - Handle exception
    //     throw err;
    // }
}

module.exports = {
    init
}