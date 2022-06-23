const { checkConfig, checkToken, saveFile } = require('../fileHandling');
const { getRange, update } = require('../google');
const inquirer = require('inquirer');
const printer = require('../printer');
const { NOTIFY, QUES } = printer;

const addLang = async (argv) => {
    printer.printWelcome();

    const config = checkConfig();
    if (!config.hasConfig) return printer.error(NOTIFY.config_DNE);
    if (!config.valid) return printer.error(NOTIFY.config_malformed);

    const token = checkToken(config.data.path);
    if (!token.hasToken) return printer.error(NOTIFY.token_DNE);
    if (!token.valid) return printer.error(NOTIFY.token_malformed);

    const languages = typeof argv.lang == 'string' ? [argv.lang] : argv.lang;
    const repeated = config.data.languages.filter(elem => languages.includes(elem));
    const proceed = repeated.length ? await inquirer.prompt({
        name: 'value',
        message: printer.question(QUES.config_add_lang_exists, { "%LANGS%": JSON.stringify(repeated) }),
        type: 'confirm'
    }) : { value: true };
    if (!proceed.value) return;
    let newConfig = config.data;
    newConfig.languages = newConfig.languages.concat(languages.filter(elem => !config.data.languages.includes(elem)));

    const data = await getRange('1:1', config.data, token.data);
    const rows = data?.values;
    if (!rows || !rows.length) return printer.error(NOTIFY.spreadsheet_no_data);
    const intersection = rows[0].filter(elem => languages.includes(elem));
    if (intersection.length) return printer.error(NOTIFY.spreadsheet_lang_exists, { "%LANGS%": JSON.stringify(intersection) });

    const startPos = `${String.fromCharCode(rows[0].length+65)}`;
    const endPos = `${String.fromCharCode(rows[0].length+65+languages.length)}`;
    const range = `${startPos}:${endPos}`;

    let updateResult = await update([languages], range, config.data, token.data);
    if (!updateResult) return;

    saveFile({
        path: 'i18n_config.json',
        data: JSON.stringify(newConfig, null, 4),
        message: printer.NOTIFY.config_update_success
    });
}


exports.command = 'add-lang';
exports.desc = 'Adds a language to the configuration and generates the first column in google sheets.\n';
exports.builder = {
    lang: {
        describe: 'key of new lang',
        demandOption: true,
        type: 'string'
    }
}
exports.handler = (argv) => addLang(argv);