const chalk = require('chalk');
const supportsHyperLinks = require('supports-hyperlinks');

const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

const _urlToLin = (text, url) => {
    return [
		OSC,
		'8',
		SEP,
		SEP,
		url,
		BEL,
		text,
		OSC,
		'8',
		SEP,
		SEP,
		BEL
	].join('');
}

const printWelcome = () => {
    console.log(chalk.blueBright('==============================='));
    console.log(chalk.blue('    Welcome to GOOGLE     '));
    console.log(chalk.blue('    SHEETS I18N to JSON     '));
    console.log(chalk.blueBright('==============================='));
}

/**
 * @param {('info'|'warn'|'error'|'url'|'question'|'success')} type - type of status
 * @returns A generated pre-pending tag for the console to indicate type of message
 */
const status = (type) => {
    switch (type) {
        case "success":
            return (chalk.blue('[') + chalk.green('SUCCESS') + chalk.blue(']'));

        case "info":
            return (chalk.blue('[') + chalk.cyan('INFO') + chalk.blue(']'));

        case "warn":
            return (chalk.blue('[') + chalk.yellow('WARNING') + chalk.blue(']'));

        case "error":
            return (chalk.blue('[') + chalk.red('ERROR') + chalk.blue(']'));

        case "url":
            return (chalk.blue('[') + chalk.green('URL') + chalk.blue(']'));

        case "question":
            return (chalk.blue('[') + chalk.green('QUESTION') + chalk.blue(']'));

        default:
            return (chalk.blue('[') + chalk.black(type) + chalk.blue(']'));
    }
}

/**
 * @param {string} msg - message
 * @returns msg underlined
 */
const underline = (msg) => {
    return chalk.underline(msg);
}

/**
 * Replaces the keys in dict with the corresponding vaue in msg
 * @param {string} msg - message to parse
 * @param {object} dict - object containing all values
 * @returns 
 */
const _parseMessage = (msg, dict) => {
    let newMsg = msg;
    Object.keys(dict).forEach(key => {
        newMsg = newMsg.replace(key, dict[key]);
    });
    return newMsg;
}

/**
 * Informs a success message on the console
 * @param {string} msg - message to display
 * @param {object} dict - any replaceables in the msg
 */
const success = (msg, dict) => {
    let newMsg = dict ? _parseMessage(msg, dict) : msg;
    console.log(status('success') + " " + newMsg);
}

/**
 * Informs a message on the console
 * @param {string} msg - message to display
 * @param {object} dict - any replaceables in the msg
 */
const inform = (msg, dict) => {
    let newMsg = dict ? _parseMessage(msg, dict) : msg;
    console.log(status('info') + " " + newMsg);
}

/**
 * Warns a message on the console
 * @param {string} msg - message to display
 * @param {object} dict - any replaceables in the msg
 */
const warn = (msg, dict) => {
    let newMsg = dict ? _parseMessage(msg, dict) : msg;
    console.log(status('warn') + " " + newMsg);
}

/**
 * Error a message on the console
 * @param {string} msg - message to display
 * @param {object} dict - any replaceables in the msg
 */
const error = (msg, dict) => {
    let newMsg = dict ? _parseMessage(msg, dict) : msg;
    console.log(status('error') + " " + newMsg);
}

/**
 * Returns the message in a question format
 * @param {string} msg - message to display
 * @param {object} dict - any replaceables in the msg
 */
const question = (msg, dict) => {
    let newMsg = dict ? _parseMessage(msg, dict) : msg;
    return (status('question') + " " + newMsg);
}

/**
 * Pritns a url to the console
 * @param {string} text - text to display
 * @param {string} url - url to go to
 */
const url = (text, url) => {
    if (supportsHyperLinks.stdout) {
        console.log(status('url') + " " + _urlToLin(text, url));
    } else {
        console.log(status('url') + " " + url);
    }
}

const TAGS = {
    spreadsheet_url: "(CTRL or ⌘) + Click-Me to go to spreadsheet",
    authentication_url: "(CTRL or ⌘) + Click-Me to go authenticate"
}

const NOTIFY = {
    gitignore_check_exists: 'Checking if .gitignore exists and ensuring i18n_token.json is in it.',
    gitignore_DNE: '.gitignore does not exists. Create one or check if this is a git repo.',
    gitignore_update: 'Updated .gitignore to include i18n_token.json.',
    config_exists: "i18n_config.json exists. Run 'gs-i18n-json clean --config' then init or add --force to execute this command.",
    config_check_exists: 'Checking if i18n_config.json exists.',
    config_DNE: "Config not found. Please run 'gs-i18n-json init' first or make sure that i18n_config.json is at the root of the directory.",
    config_malformed: "Config found but malformed. Please run 'gs-i18n-json init' and the process will allowed to be run due to malformation.",
    config_path_nm: 'You cannot save the files in node_modules. Please select a different folder.',
    config_create_success: 'Config successfully generated, located at the root folder named i18n_config.json.',
    config_update_success: 'Config updated successfully.',
    config_found_by_id: "Spreadsheet named [%NAME%] found.",
    path_not_dir: 'Path is not a directory. Please input a directory.',
    path_not_found_retry: 'No path found. Please try to input the path again.',
    token_exists: "i18n_token.json exists. run `gs-i18n-json authorize` to re-create token if needed.",
    token_overwrite: "Token found, but overwriting existing token.%DATE%",
    token_check_exists: 'Checking if token exists.',
    token_create: 'i18n_token.json does not exists. Attempting to generate token.',
    token_DNE: "Token not found. Please run 'gs-i18n-json init' or 'gs-i18n-json authorize' to create token.",
    token_DNE_create: "Token not found. Follow the steps to create one.",
    token_malformed: "Token found but malformed. Please run 'gs-i18n-json authorize' to re-create token.",
    token_auth_request: "Authorize google-sheet-i18n-to-json by visiting the following URL. Then copy and paste the code below:",
    token_auth_failed: "Error while trying to retrieve access token. Recieved: [%CODE%] %MSG%",
    token_auth_retry: "Please try to input the code again.",
    spreadsheet_create_failed: "Error while creating spreadsheet. Recieved: [%CODE%] %MSG%",
    spreadsheet_url_click: 'The following is the link to view the spreadsheet where you can edit i18n translations.',
    spreadsheet_init_failed: "Error while initializing data in spreadsheet. Recieved: [%CODE%] %MSG%",
    spreadsheet_no_data: "No data found",
    spreadsheet_fetch_failed: "Error while fetching from spreasdsheet. Recieved: [%CODE%] %MSG%",
    spreadsheet_append_failed: "Error while appending to spreasdsheet. Recieved: [%CODE%] %MSG%",
    spreadsheet_new_sheet_failed: "Error while adding new sheet to spreasdsheet. Recieved: [%CODE%] %MSG%",
    spreadsheet_lang_exists: "Checking languages in sheets and found that the following exist: %LANGS%",
    spreadsheet_lang_DNE: "Checking languages in sheets and could not find the following exist: %LANGS%",
    spreadsheet_backup_success: "Saving backup before modifying success. Backup stored at %PATH%.",
    spreadsheet_backup_remove_success: "Removing backup after modifying i18n success",
    update_success: "Successfully pulled the new json objects.",
    success_add_lang: "Successfully update google sheets and config to include the following languages: %LANGS%",
    success_delete_lang: "Successfully update google sheets and config to not include the following languages: %LANGS%",
    success_delete_lang_json: "Successfully delete %LANG%.json.",
    success_add_token: "Successfully updated token.",
    success_clean: "Succesfully removed google-sheet-i18n-to-json files.",
    clean_file_found: "Successfully found and removed %TYPE% file at '%PATH%'",
    clean_file_DNE: "%TYPE% file not found.",
    clean_delete_spreadsheet: "Delete a spreadsheet through CLI is impossible. Please visit " + chalk.underline("https://docs.google.com/spreadsheets/u/0/") + " to delete the corresponding spreadsheet.",
    question_answer_empty: "Answer must not be empty. Please try again.",
    command_DNE: "command '%CMD%' does not exist. Please run 'gs-i18n-json --help' to see a full list of commands."
}

const QUES = {
    config_malformed: 'i18n_config.json seems to be malformed, do you wish to reconfigure: ',
    config_path: 'Where do you want to store files(i18n_token and i18n json objects)?',
    config_path_type: 'Please type in the path of the directory to store the files(e.g src/i18n): ',
    config_path_select: 'Please select a directory(Current directory is %PATH%): ',
    config_languages: 'Please selected the languages you would like to create i18n json objects(You can always add custom language keys after): ',
    config_add_lang_exists: 'The configuration file seems to include: %LANGS%. Do you wish to proceed to initialize columns in google sheets?',
    config_some_lang_DNE: "The following languages do not exist in the config: %LANGS%. Do you wish to proceed?",
    config_lang_DNE: "Error indexing languages. None of them exist in the config file.",
    config_lang_confirm_delete: "Are you sure you want to delete the following languages: %LANGS% ?",
    config_input_spreadsheetId: "Please type in the spreadsheet ID:",
    config_select_sheet: "Please select the corresponding sheet from the retireved sheet list:",
    config_languages_found: "Found the following languages keys: %LANGS%. Please confirm that this is correct.",
    token_malformed: 'i18n_token.json seems to be malformed, do you wish to reconfigure: ',
    token_auth_request: 'Please enter the code from that page here:',
    spreadsheet_name: 'Please type in the name of the spreadsheet you would like:',
    sheet_name: 'Please type in the name of the sheet you would like(e.g web, app e.t.c): ',
    clean_remove_config: "Intention to remove config found. " + chalk.underline("Are you sure you want to remove the config file?"),
}

module.exports = {
    printWelcome,
    status,
    underline,
    success,
    inform,
    warn,
    error,
    question,
    url,
    NOTIFY,
    QUES,
    TAGS
}