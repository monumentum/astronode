const program = require('commander');
const version = require('../../package.json').version;

const setupCallback = require('./setup');

module.exports = runCallback => {
    program.version(version);

    program
        .command('setup')
            .option('--engine', 'the engine adapter that you want')
            .option('--driver', 'the driver adapter that you want')
            .action(setupCallback)

    program.command('run')
            .option('--configFile', 'Select configs file')
            .option('--routeFile', 'Select routes file')
            .action(runCallback)

    program.parse(process.argv);
}