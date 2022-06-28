const { checkConfig, checkToken, saveFile, deleteFile, fileExists } = require('../fileHandling');
const { batchClear, readAllData, batchUpdate } = require('../google');
const inquirer = require('inquirer');
const printer = require('../printer');
const { NOTIFY, QUES } = printer;

const deleteLang = async (argv) => {
    printer.printWelcome();

    // 1. Config and Token checking
    const config = checkConfig();
    if (!config.hasConfig) return printer.error(NOTIFY.config_DNE);
    if (!config.valid) return printer.error(NOTIFY.config_malformed);

    const token = checkToken(config.data.path);
    if (!token.hasToken) return printer.error(NOTIFY.token_DNE);
    if (!token.valid) return printer.error(NOTIFY.token_malformed);

    // 2. Check arguments agains config languages and languages on sheets
    const languages = typeof argv.lang == 'string' ? [argv.lang] : argv.lang;
    const found = languages.filter(elem => config.data.languages.includes(elem));
    const notFound = languages.filter(elem => !config.data.languages.includes(elem));
    const proceed = (notFound.length && found.length) ? await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.config_some_lang_DNE, { "%LANGS%": JSON.stringify(notFound) }),
        type: 'confirm'
    }) : { value: true };
    if (!proceed.value) return;
    if (notFound.length && !found.length) return printer.error(QUES.config_lang_DNE);

    // 3. Start modifying config and rows
    let newConfig = config.data;
    newConfig.languages = newConfig.languages.filter(lang => !found.includes(lang));

    const data = await readAllData(config.data, token.data);
    const rows = data?.values;
    if (!rows || !rows.length) return printer.error(NOTIFY.spreadsheet_no_data);
    const missing = found.filter(elem => !rows[0].includes(elem));
    if (missing.length) return printer.error(NOTIFY.spreadsheet_lang_DNE, { "%LANGS%": JSON.stringify(missing) });

    let newValues = data.values;
    let spliceIndexes = [];
    found.forEach(lang => {
        let idx = newValues[0].indexOf(lang);
        spliceIndexes.push(idx);
        newValues[0].splice(idx, 1);
    });
    newValues.slice(1).forEach((row, idx) => {
        spliceIndexes.forEach(splicePos => row.splice(splicePos, 1));
        newValues[idx+1] = row;
    });

    const confirmDelete = await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.config_lang_confirm_delete, { "%LANGS%": JSON.stringify(found) }),
        type: 'confirm'
    });
    if (!confirmDelete.value) return;
    // 4. Save a backup before modifying sheets
    let backupString = '';
    data.values.forEach(x => {
        let row = x.join('\t') + '\n';
        backupString += row;
    });
    let saveBackupSuccess = saveFile({
        path: `${config.data.path}/backup.xls`,
        data: backupString,
        message: NOTIFY.spreadsheet_backup_success.replace("%PATH%", `${config.data.path}/backup.xls`)
    });
    if (!saveBackupSuccess) return;

    // 5. Clear all data, save the new data and then save the config file
    const batchResult = await batchClear(config.data.sheetName, config.data, token.data);
    if (!batchResult) return;
    const updateResource = [{ range: config.data.sheetName, values: newValues }];
    const updateResult = await batchUpdate(updateResource, config.data, token.data);
    if (!updateResult) return;

    deleteFile({
        path: `${config.data.path}/backup.xls`,
        message: NOTIFY.spreadsheet_backup_remove_success
    });

    found.forEach(lang => {
        if (fileExists(`${config.data.path}/${lang}.json`)) {
            deleteFile({
                path: `${config.data.path}/${lang}.json`,
                message: NOTIFY.success_delete_lang_json.replace("%LANG%", lang)
            });
        }
    })

    const saveConfigSuccess = saveFile({
        path: 'i18n_config.json',
        data: JSON.stringify(newConfig, null, 4),
        message: printer.NOTIFY.config_update_success
    });
    if (saveConfigSuccess) printer.success(NOTIFY.success_delete_lang, { "%LANGS%": JSON.stringify(found) });
    console.log("");
}


exports.command = 'delete-lang';
exports.desc = 'Deletes a language from the configuration and removes the column in google sheets.\n';
exports.builder = {
    lang: {
        describe: 'key of new lang',
        demandOption: true,
        type: 'string'
    }
}
exports.handler = (argv) => deleteLang(argv);