#!/usr/bin/env node

const yargs = require('yargs');
const { init } = require('./src/init');

yargs
    .scriptName("[Config Intiaizlier]")
    .usage('')
    .command(
        'init',
        'Initializes the configurations after answering several questions in a file named i18n_config.json. Command will also require writing permissions from google. This requires a token to be stored in i18n_credentials.json. Prior to running, we will ensure that this file is ignored in .gitignore.',
        (yargs) => yargs,
        (argv) => init()
    )
    .help()
    .argv