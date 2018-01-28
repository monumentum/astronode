const Promise = require('bluebird');
const { has } = require('lodash');

const getConfig = require('./configuration');

const CONFIG_FILE = 'astronode.config.json';
const ROUTE_FILE = 'astronode.routes.json';

exports.initServer = adapter => {
    return adapter.start();
};

exports.mountApp = (configFile, routerFile, customFns) =>
    getConfig(configFile, routerFile).then(config => {
        const engine = config.plugins[config.opts.engine];
        engine.setRoutes(config.routes);

        return Promise.resolve(engine, config);
    });

exports.runAstronode = ({ configFile = CONFIG_FILE, routeFile = ROUTE_FILE }) => {
     return exports.mountApp(configFile, routeFile)
                .then(exports.initServer);
};