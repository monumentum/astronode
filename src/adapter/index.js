const Promise = require('bluebird');
const { has } = require('lodash');

const {
    registerModules,
    registerMiddleware,
    registerPlugins,
} = require('../register');

const checkAndRun = (config, path, promise, isError) => {
    if (!has(config, path) && isError) {
        return Promise.reject('@TODO: Export astronode-plugin <MissingParameter> and alert about', path);
    } else if (!has(config, path)) {
        return Promise.resolve(null);
    }

    return promise(config);
}

exports.setupApp = config => Promise.all([
    checkAndRun(config, 'application.modules', registerModules, true),
    checkAndRun(config, 'application.middlewares', registerMiddleware),
    checkAndRun(config, 'plugins', registerPlugins),
]);

exports.mountApp = (normalizedConfig, normalizedRoutes) =>
    exports.setupApp(normalizedConfig).then(() => {
        const engine = astronode.plugins[normalizedConfig.engine];
        engine.setRoutes(normalizedRoutes);

        return engine;
    });