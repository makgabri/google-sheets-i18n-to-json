const fs = require('fs');
const readline = require('readline');
const inquirer = require('inquirer');
const { google } = require('googleapis');
const printer = require('../printer');
const { NOTIFY, QUES } = printer;
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
function authorize(token) {
    const {client_secret, client_id, redirect_uris} = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
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
    printer.inform(NOTIFY.token_auth_request);
    printer.url(authUrl);
    
    return await _readCode(oAuth2Client, tokenPath);
}

/**
 * Prompt user to enter new token.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {string} tokenPath The path to the token
 */
async function _readCode(oAuth2Client, tokenPath) {
    const code = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.token_auth_request),
        type: 'input'
    });
    try {
        const token = await oAuth2Client.getToken(code.value);
        token.tokens.createdOn = new Date().toGMTString();

        saveFile({
            path: `${ tokenPath }/i18n_token.json`,
            data: JSON.stringify(token.tokens, null, 4),
            message: `Token successfully saved to ${ tokenPath }/i18n_token.json.`
        });
        endServer();
        return token;
    } catch(err) {
        printer.error(NOTIFY.token_auth_failed, { "%CODE%": err.code || '-1', "%MSG%": err.response?.data?.error_description || err });
        printer.error(NOTIFY.token_auth_retry);
        return _readCode(oAuth2Client, tokenPath);
    }
}

/**
 * Creates the spreadsheet for i18n
 * @param {string} title title of spreadsheet
 * @param {object} config configurations as specified or from config file
 */
async function createSpreadsheet(title, sheetTitle, token) {
    const auth = authorize(token);
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
        printer.error(NOTIFY.spreadsheet_create_failed, { "%CODE%": err.code || '-1', "%MSG%": err.errors ? err.errors[0]?.message : err })
        return false;
    }
}

async function initializeSpreadsheetInfo(config, token) {
    const auth = authorize(token);
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
            spreadsheetId: config.spreadsheetId,
            range: `${config.sheetName}!A1:${String.fromCharCode(config.languages.length+65)}${config.languages.length+2}`,
            valueInputOption: 'RAW',
            includeValuesInResponse: false,
            resource: { values }
        });
        return true;
    } catch (err) {
        printer.error(NOTIFY.spreadsheet_init_failed, { "%CODE%": err.code || '-1', "%MSG%": err.errors ? err.errors[0]?.message : err });
        return false;
    }
}

function spreadSheetURL(spreadsheetId) {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;
}

async function getData(config, token) {
    const auth = authorize(token);
    if (!auth) return;

    const service = google.sheets({ version: 'v4', auth });

    try {
        const res = await service.spreadsheets.values.get({
            spreadsheetId: config.spreadsheetId,
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
            printer.warn(NOTIFY.spreadsheet_no_data);
        }
        return true;
    } catch (err) {
        printer.error(NOTIFY.spreadsheet_fetch_failed, { "%CODE%": err.code || '-1', "%MSG%": err.errors ? err.errors[0]?.message : err });
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