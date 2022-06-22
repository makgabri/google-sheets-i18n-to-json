#!/usr/bin/env node
const chalk = require('chalk');

require('yargs/yargs')(process.argv.slice(2))
    .usage(`${chalk.blueBright('===============================')}
    ${chalk.blue('\tWelcome to GOOGLE     ')}
    ${chalk.blue('\tSHEETS I18N to JSON     ')}
    ${chalk.blueBright('===============================')}
    A command line interface to initialize google sheet i18n and extract the data
    by simply running a command.
    To start off, be sure to first run 'googlesheet-i18n-to-json init'.\n
    Usage: googlesheet-i18n-to-json <cmd> [args]`)
    .commandDir('src/commands')
    .demandCommand()
    .help()
    .argv
