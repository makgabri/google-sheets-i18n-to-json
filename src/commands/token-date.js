const printer = require('../printer');
const { checkToken, checkConfig } = require('../fileHandling');

const { NOTIFY } = printer;

const tokenDate = () => {
    printer.printWelcome();

    const config = checkConfig();
    if (!config.hasConfig) return printer.error(NOTIFY.config_DNE);
    if (!config.valid) return printer.error(NOTIFY.config_malformed);

    const token = checkToken(config.data.path);
    if (!token.hasToken) return printer.error(NOTIFY.token_DNE);
    if (!token.valid) return printer.error(NOTIFY.token_malformed);
    
    printer.inform('Token created on: ' + printer.underline(token.data.createdOn));
    console.log("");
}

exports.command = 'token-date';
exports.desc = 'Displays the date of when the current token was created.';
exports.builder = {};
exports.handler = (argv) => tokenDate();