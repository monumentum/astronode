const Promise = require('bluebird');
const { registerModules, registerMiddleware } = require('../register');

const engine = require('./engine');
const driver = require('./driver');

exports.mountApp = (normalizedConfig, normalizedRoute)  => {
    const driverAdapter = new driver[normalizedConfig.driver](normalizedConfig.driverConfig);

    return Promise.all([
        driverAdapter.start(),
        registerModules(normalizedConfig),
        registerMiddleware(normalizedConfig),
    ]).then(() => {
        const engineAdapter = new engine[normalizedConfig.engine]();

        engineAdapter.setServices(driverAdapter.services);
        engineAdapter.setRoutes(normalizedRoute);

        return engineAdapter;
    });
}
