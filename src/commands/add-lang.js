const addLang = (argv) => {
    console.log(argv.lang);
}


exports.command = 'add-lang';
exports.desc = 'Adds a language to the configuration and generates the first column in google sheets.\n';
exports.builder = {
    lang: {
        describe: 'key of new lang',
        demandOption: true,
        type: 'string'
    }
}
exports.handler = (argv) => addLang(argv);