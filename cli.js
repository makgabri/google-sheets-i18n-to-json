#!/usr/bin/env node
const chalk = require('chalk');

require('yargs/yargs')(process.argv.slice(2))
    .usage(`${chalk.blueBright('===============================')}
    ${chalk.blue('\tWelcome to GOOGLE     ')}
    ${chalk.blue('\tSHEETS I18N to JSON     ')}
    ${chalk.blueBright('===============================')}
    A command line interface to initialize google sheet i18n and extract the data
    by simply running a command.\n
    Usage: googlesheet-i18n-to-json <cmd> [args]`)
    .commandDir('src/commands')
    .demandCommand()
    .help()
    .argv

// const yargs = require('yargs');
// const { init } = require('./src/commands/init');
// const { authorize } = require('./src/commands/authorize');
// const { tokenDate } = require('./src/commands/token-date');
// const { update } = require('./src/commands/update');

// yargs
//     .scriptName("google-sheet-i18n-to-json")
//     .usage('Usage: $0 <command> [options]')
//     .command(
//         'init',
//         'Initializes the configurations after answering several questions in a file named i18n_config.json. Command will also require writing permissions from google. This requires a token to be stored in i18n_token.json. Prior to running, we will ensure that this file is ignored in .gitignore.\n',
//         (yargs) => yargs,
//         (argv) => init() // TODO: LOOK INTO --force option
//     )

//     .usage('Usage: $0 <command> [options]')
//     .command(
//         'authorize',
//         'This is not a pre-requisite when running init as init will automatically run this. Run this if you have lost the file, or want to regenerate your token.\n',
//         (yargs) => yargs,
//         (argv) => authorize()
//     )

//     .usage('Usage: $0 <command> [options]')
//     .command(
//         'update',
//         'After setup, run this to update the corresponding i18n json files.\n',
//         (yargs) => yargs,
//         (argv) => update()
//     )

//     .usage('Usage: $0 <command> [options]')
//     .command(
//         'token-date',
//         'Displays the date of when the current token was created.\n',
//         (yargs) => yargs,
//         (argv) => tokenDate()
//     )

//     .usage()

//     .help()
//     .argv

