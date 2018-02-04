const Promise = require('bluebird');
const getConfig = require('./configuration');

const CONFIG_FILE = 'astronode.config.json';
const ROUTE_FILE = 'astronode.routes.json';

exports.initServer = (engine, opts) => engine.start(opts);

exports.mountApp = (configFile, routerFile) =>
    getConfig(configFile, routerFile)
        .then(config => {
            const engine = config.plugins[config.opts.engine];
            engine.setRoutes(config.routes);

            return Promise.resolve([engine, config.opts]);
        });

exports.runAstronode = ({ configFile = CONFIG_FILE, routeFile = ROUTE_FILE }) =>
    exports.mountApp(configFile, routeFile)
        .spread(exports.initServer);