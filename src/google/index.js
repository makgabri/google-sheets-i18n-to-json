const fs = require('fs');
const readline = require('readline');
const inquirer = require('inquirer');
const { google } = require('googleapis');
const { status } = require('../helper');
const { saveFile } = require('../fileHandling');
const { startServer, endServer } = require('../server');
const langToLocale = require('./locale-to-lang.json');

const credentials = require('./credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

_getClient = () => {
    const {client_secret, client_id, redirect_uris} = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return oAuth2Client;
}

/**
 * Create an OAuth2 client with the given credentials, and return the auth client.
 */
function authorize(config) {
    if (!config.path) {
        console.log(status("error") + " Configuration issue, path not found.");
        return false;
    }
    const {client_secret, client_id, redirect_uris} = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const token = fs.readFileSync(`${config.path}/i18n_token.json`);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization.
 */
async function getNewToken(tokenPath) {
    startServer();
    const oAuth2Client = _getClient();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log(status("info") + ' Authorize google-sheet-i18n-to-json by visiting the following URL. Then copy and paste the code below:')
    console.log(status("url") + " " + authUrl);
    
    await _readCode(oAuth2Client, tokenPath);
}

/**
 * Prompt user to enter new token.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {string} tokenPath The path to the token
 */
async function _readCode(oAuth2Client, tokenPath) {
    const code = await inquirer.prompt({
        name: 'value',
        message: (status("question") + " Please enter the code from that page here: "),
        type: 'input'
    });
    try {
        const token = await oAuth2Client.getToken(code.value);
        token.tokens.createdOn = new Date().toGMTString();

        saveFile({
            path: `${ tokenPath }/i18n_token.json`,
            data: JSON.stringify(token.tokens, null, 4),
            message: `Token successfully saved to i18n_token.json.`
        });
        endServer();
    } catch(err) {
        console.error(status("error") + ' Error while trying to retrieve access token.', `Recieved: [${err.code || '-1'}] ${err.response?.data?.error_description || err}`);
        console.error(status("error") + ' Please try to input the code again.');
        return _readCode(oAuth2Client, tokenPath);
    }
}

/**
 * Creates the spreadsheet for i18n
 * @param {string} title title of spreadsheet
 * @param {object} config configurations as specified or from config file
 */
async function createSpreadsheet(title, sheetTitle, config) {
    const auth = authorize(config);
    if (!auth) return;

    const service = google.sheets({version: 'v4', auth});
    const resource = {
        properties: {
            title,
        },
    };
    try {
        let spreadsheet = await service.spreadsheets.create({ resource });
        await service.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheet.data.spreadsheetId,
            resource: { requests: [
                {
                    updateSheetProperties: {
                        properties: {
                            sheetId: spreadsheet.data.sheets[0]?.properties.sheetId,
                            title: sheetTitle,
                        },
                        fields: 'title',
                    }
                }
            ]}
        });
        spreadsheet.data.sheets[0].properties.title = sheetTitle;

        return spreadsheet.data;
    } catch (err) {
        console.log(status('error') + " Creating spreadsheet returned with the following error message: " + `[${err.code || -1 }] ${err.errors ? err.errors[0]?.message : err}`);
        return false;
    }
}

async function initializeSpreadsheetInfo(spreadsheet, config) {
    const auth = authorize(config);
    if (!auth) return;

    const service = google.sheets({ version: 'v4', auth });
    let values = [[ "KEY", ...config.languages ]];
    config.languages.forEach(lang => {
        let value = langToLocale[lang] ? langToLocale[lang].nativeName : lang;
        values.push([ lang, ...Array(config.languages.length).fill(value) ]);
    });
    values.push([ "Hello", ...config.languages.map(lang => `Hello in ${lang}`)]);

    try {
        await service.spreadsheets.values.update({
            spreadsheetId: spreadsheet.spreadsheetId,
            range: `${config.sheetName}!A1:${String.fromCharCode(config.languages.length+65)}${config.languages.length+2}`,
            valueInputOption: 'RAW',
            includeValuesInResponse: false,
            resource: { values }
        });
        return true;
    } catch (err) {
        console.log(status('error') + " Initializing spreadsheet format returned with the following error message: " + `[${err.code}] ${err.errors[0]?.message}`);
        return false;
    }
}

function spreadSheetURL(spreadsheetId) {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;
}

async function getData(config) {
    const auth = authorize(config);
    if (!auth) return;

    const service = google.sheets({ version: 'v4', auth });

    try {
        const res = await service.spreadsheets.values.get({
            spreadsheetId: config.spreadSheetId,
            range: `${config.sheetName}!A:${String.fromCharCode(config.languages.length+65)}`,
        });
        
        const rows = res.data.values;
        if (rows.length) {
            let resultJson = {};
            let keys = rows.shift();
            keys.shift();
            rows.map((row) => {
                resultJson[row[0]] = {};
                keys.forEach((langKey, idx) => {
                    resultJson[row[0]][langKey] = row[idx+1];
                });
            });

            config.languages.forEach(lang => {
                extractLang(resultJson, lang, config);
            });
        } else {
            console.log(status('warn') + ' No data found.');
        }
        
    } catch (err) {
        console.log(status('error') + " Fetching spreadsheet data returned with the following error message: " + `[${err.code || '-1'}] ${err.errors ? err.errors[0]?.message : err}`);
        return false;
    }
}

function extractLang(jsonData, lang, config) {
    let langData = {};
    Object.keys(jsonData).forEach((keyword) => {
        langData[keyword] = jsonData[keyword][lang];
    });
    saveFile({
        path: `${config.path}/${lang}.json`,
        data: JSON.stringify(langData, null, 4),
        message: `Successfully extracted ${lang} to ${config?.path ? config.path+'/' : ''}${lang}.json`
    });
}

module.exports = {
    getNewToken,
    createSpreadsheet,
    initializeSpreadsheetInfo,
    spreadSheetURL,
    getData
}