const { omit } = require('lodash');
const { mountApp } = require('./adapter');
const { normalizeProcessVariables } = require('./util');

const CONFIG_FILE = 'astronaut.config.json';
const ROUTE_FILE = 'astronaut.route.json';

global.astronaut = {
    ROOT_PATH: process.cwd(),
    middlewares: {},
    controllers: {},
    models: {},
    config: {}
};

exports.runServerFunction = adapter => {
    require(astronaut.MODULES_PATH).server(adapter.app);
    return adapter;
};

exports.initServer = adapter => {
    return adapter.start();
};


exports.runAstronaut = ({ configFile, routeFile }) => {
    configFile = `${astronaut.ROOT_PATH}/${configFile}`;
    routeFile = `${astronaut.ROOT_PATH}/${routeFile}`;

    const configs = require(configFile);
    const route = require(routeFile);

    const normalizedConfig = normalizeProcessVariables(configs);
    const normalizedRoute = normalizeProcessVariables(route);

    astronaut.MODULES_PATH = `${astronaut.ROOT_PATH}/${normalizedConfig.modules.root}`;
    astronaut.config = omit(normalizedConfig, 'database', 'modules', 'middleware');

    return mountApp(normalizedConfig, normalizedRoute);
};

if (module === require.main) {
    const program = require('commander');

    program
        .version('0.1.0')
        .option('-C, --configFile <config_file>', 'Select configs file', CONFIG_FILE)
        .option('-R, --routeFile <route_file>', 'Select routes file', ROUTE_FILE)
        .parse(process.argv);

    exports.runAstronaut(program)
        .then(exports.runServerFunction)
        .then(exports.initServer);
}