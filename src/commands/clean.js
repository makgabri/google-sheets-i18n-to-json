const inquirer = require('inquirer');
const { checkConfig, checkToken, deleteFile, fileExists } = require('../fileHandling');
const printer = require('../printer')
const { NOTIFY, QUES } = printer;
// const { getNewToken } = require('../google/index');

const clean = async (argv) => {
    printer.printWelcome();

    const config = checkConfig();
    if (!config.hasConfig) return printer.error(NOTIFY.config_DNE);
    if (!config.valid) return printer.error(NOTIFY.config_malformed);

    const token = checkToken(config.data.path);
    if (!token.hasToken) printer.warn(NOTIFY.clean_file_DNE.replace("%TYPE%", "Token"));
    if (token.hasToken) deleteFile({
        path: `${config.data.path}/i18n_token.json`,
        message: NOTIFY.clean_file_found
            .replace("%TYPE%", "Token")
            .replace("%PATH%", `${config.data.path}/i18n_token.json`)
    });

    config.data.languages.forEach(lang => {
        if (fileExists(`${config.data.path}/${lang}.json`)) {
            deleteFile({
                path: `${config.data.path}/${lang}.json`,
                message: NOTIFY.clean_file_found
                    .replace("%TYPE%", `${lang} JSON`)
                    .replace("%PATH%", `${config.data.path}/${lang}.json`)
            });
        } else {
            printer.warn(NOTIFY.clean_file_DNE.replace("%TYPE%", `${lang} JSON`));
        }
    })

    if (argv.config) {
        const confirm = await inquirer.prompt({
            name: 'value',
            message: printer.question(QUES.clean_remove_config),
            type: 'confirm'
        });
        if (confirm.value) {
            if (fileExists('i18n_config.json')) {
                deleteFile({
                    path: `i18n_config.json`,
                    message: NOTIFY.clean_file_found
                        .replace("%TYPE%", `Config`)
                        .replace("%PATH%", `i18n_config.json`)
                });
            } else {
                printer.error(NOTIFY.clean_file_DNE.replace("%TYPE%", `Config`));
            }
        }
    }

    printer.success(NOTIFY.success_clean);
    printer.inform(NOTIFY.clean_delete_spreadsheet);
    console.log("");
}

exports.command = 'clean';
exports.desc = 'This command is to cleanup anything regarding this library. As long as the config is not delete, anything else can be re-generated. You can additionally add --config to also remove the config.\n';
exports.builder = {
    config: {
        describe: 'Indicate whether to also remove config',
        type: 'boolean'
    }
};
exports.handler = (argv) => clean(argv);