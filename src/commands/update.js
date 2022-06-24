const { checkConfig, checkToken } = require('../fileHandling');
const { getData, getNewToken } = require('../google');
const printer = require('../printer');
const { NOTIFY } = printer;

const update = async () => {
    printer.printWelcome();

    const config = checkConfig();
    if (!config.hasConfig) return printer.error(NOTIFY.config_DNE);
    if (!config.valid) return printer.error(NOTIFY.config_malformed);

    let token = checkToken(config.data.path);
    if (!token.hasToken) {
        printer.inform(NOTIFY.token_DNE_create)
        let newToken = await getNewToken(config.data.path);
        if (!newToken) return;
        token = checkToken(config.data.path);
    }
    if (token.hasToken && !token.valid) return printer.error(NOTIFY.token_malformed);

    const result = await getData(config.data, token.data);
    if (result) printer.success(NOTIFY.update_success + '\n');
    console.log("");
}

exports.command = 'update';
exports.desc = 'After setup, run this to update the corresponding i18n json files.\n';
exports.builder = {};
exports.handler = (argv) => update();