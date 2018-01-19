const program = require('commander');
const version = require('../../package.json').version;

const setupCallback = require('./setup');

const CONFIG_FILE = 'astronode.config.json';
const ROUTE_FILE = 'astronode.route.json';

module.exports = runCallback => {
    program.version(version);

    program
        .command('setup')
            .option('--engine', 'the engine adapter that you want')
            .option('--driver', 'the driver adapter that you want')
            .action(setupCallback)

    program.command('run')
            .option('-C, --configFile <config_file>', 'Select configs file', CONFIG_FILE)
            .option('-R, --routeFile <route_file>', 'Select routes file', ROUTE_FILE)
            .action(runCallback)

    program.parse(process.argv);
}