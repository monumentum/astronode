const CONFIG_FILE = 'astronaut.config.json';
const ROUTE_FILE = 'astronaut.route.json';

const { mountApp } = require('./adapter');
const { normalizeProcessVariables, initDatabase } = require('./util');

const APPLICATION_ROOT_PATH = process.cwd();

exports.runAstronaut = ({ configFile, routeFile, libName }) => {
    configFile = `${APPLICATION_ROOT_PATH}/${configFile}`;
    routeFile = `${APPLICATION_ROOT_PATH}/${routeFile}`;

    const configs = require(configFile);
    const route = require(routeFile);

    const normalizedConfig = normalizeProcessVariables(configs);
    const normalizedRoute = normalizeProcessVariables(route);

    initDatabase(normalizedConfig.database);
    return mountApp(libName, normalizedConfig, normalizedRoute);
}

if (module === require.main) {
    const program = require('commander');

    program
        .version('0.1.0')
        .option('-C, --configFile <config_file>', 'Select configs file', CONFIG_FILE)
        .option('-R, --routeFile <route_file>', 'Select routes file', ROUTE_FILE)
        .option('-L, --libName <lib>', 'Select lib installed', /^(express)$/i)
        .parse(process.argv);

    exports.runAstronaut(program);
}