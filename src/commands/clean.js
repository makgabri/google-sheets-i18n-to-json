const { checkConfig, checkToken, deleteFile } = require('../fileHandling');
const printer = require('../printer')
const { NOTIFY } = printer;
// const { getNewToken } = require('../google/index');

const clean = async (argv) => {
    printer.printWelcome();

    const config = checkConfig();
    // if (config.hasConfig) deleteFile()

    const token = checkToken(config.data.path);
    if (token.hasToken) deleteFile({
        path: `${config.data.path}/i18n_token.json`,
        message: //TODO here
    })

    // printer.success(NOTIFY.success_add_token);
    // console.log("");
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