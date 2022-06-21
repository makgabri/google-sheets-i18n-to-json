#!/usr/bin/env node

const yargs = require('yargs');
const { init, getNewToken } = require('./src/init');

yargs
    .scriptName("google-sheet-i18n-to-json")
    .usage('')
    .command(
        'init',
        'Initializes the configurations after answering several questions in a file named i18n_config.json. Command will also require writing permissions from google. This requires a token to be stored in i18n_token.json. Prior to running, we will ensure that this file is ignored in .gitignore.',
        (yargs) => yargs,
        (argv) => init()
    )

    .usage('')
    .command(
        'authorize',
        'This is not a pre-requisite when running init as init will automatically run this. Run this if you have lost the file, or want to regenerate your token.',
        (yargs) => yargs,
        (argv) => getNewToken()
    )

    .usage('')
    .command(
        'authorize',
        'Updates i18n_token.json by providing authentication link and requiring you to copy-paste the code into the command line. google-sheet-i18n-to-json init is required to have run before hand.',
        (yargs) => yargs,
        (argv) => authorize()
    )

    .help()
    .argv

