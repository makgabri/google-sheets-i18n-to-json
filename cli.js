#!/usr/bin/env node
const chalk = require('chalk');
const printer = require('./src/printer');

const availableCommands = [
    'add-lang',
    'authorize',
    'clean',
    'delete-lang',
    'init',
    'link-new',
    'link',
    'token-date',
    'update'
]

require('yargs/yargs')(process.argv.slice(2))
    .usage(`${chalk.blueBright('===============================')}
    ${chalk.blue('\tWelcome to GOOGLE     ')}
    ${chalk.blue('\tSHEETS I18N to JSON     ')}
    ${chalk.blueBright('===============================')}
    A command line interface to initialize google sheet i18n and extract the data
    by simply running a command.
    To start off, be sure to first run 'gs-i18n-json init'.\n
    Usage:
    google-sheet-i18n-to-json <cmd> [args]
    gs-i18n-json <cmd> [args]`)
    .commandDir('src/commands')
    .demandCommand()
    .alias('google-sheet-i18n-to-json', 'gs-i18n')
    .help()
    .middleware(argv => {
        if (argv._[0] && !availableCommands.includes(argv._[0])) {
            printer.error(printer.NOTIFY.command_DNE, { "%CMD%": argv._[0]})
        }
    })
    .argv
