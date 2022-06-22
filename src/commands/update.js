const { checkConfig, checkToken } = require('../fileHandling');
const { getData } = require('../google');
const printer = require('../printer');

const update = async () => {
    printer.printWelcome();

    const config = checkConfig();
    if (!config.hasConfig) return printer.error(NOTIFY.config_DNE);
    if (!config.valid) return printer.error(NOTIFY.config_malformed);

    const token = checkToken(config.data.path);
    if (!token.hasToken) return printer.error(NOTIFY.token_DNE);
    if (!token.valid) return printer.error(NOTIFY.token_malformed);

    const result = await getData(config.data, token.data);
    if (result) printer.inform(printer.NOTIFY.update_success + '\n');
}

module.exports = {
    update
}