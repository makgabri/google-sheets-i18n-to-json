const chalk = require('chalk');

const printWelcome = () => {
    console.log(chalk.blueBright('==============================='));
    console.log(chalk.blue('    Welcome to GOOGLE     '));
    console.log(chalk.blue('    SHEETS I18N to JSON     '));
    console.log(chalk.blueBright('==============================='));
}

const status = (type) => {
    switch (type) {
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

module.exports = {
    printWelcome,
    status
}