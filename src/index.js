const Promise = require('bluebird');
const getConfig = require('./configuration');

const { toPairs } = require('lodash');

const CONFIG_FILE = 'astronode.config.json';
const ROUTE_FILE = 'astronode.routes.json';

exports.initServer = (engine, opts) => engine.start(opts);

exports.runPlugins = config => Promise.map(
    toPairs(config.plugins),
    ([, plugin]) => plugin.autoinitialize ? plugin.autoinitialize(config) : Promise.resolve(),
    { concurrency: 20 }
).then(() => config);

exports.mountApp = (configFile, routerFile) =>
    getConfig(configFile, routerFile)
        .then(exports.runPlugins)
        .then(config => {
            const engine = config.plugins[config.opts.engine];
            engine.setRoutes(config.routes);

            return Promise.resolve([engine, config.opts]);
        });

exports.runAstronode = ({ configFile = CONFIG_FILE, routeFile = ROUTE_FILE }) =>
    exports.mountApp(configFile, routeFile)
        .spread(exports.initServer);