const Promise = require('bluebird');
const { registerModules, registerMiddleware } = require('../register');

const engine = require('./engine');
const driver = require('./driver');

exports.mountApp = (normalizedConfig, normalizedRoute)  => {
    return Promise.all([
        registerModules(normalizedConfig),
        registerMiddleware(normalizedConfig),
    ]).then(() => {
        const engineAdapter = new engine[normalizedConfig.engine]();
        const driverAdapter = driver[normalizedConfig.driver];

        driverAdapter.start(normalizedConfig.driverConfig);

        engineAdapter.setServices(driverAdapter.Services);
        engineAdapter.setRoutes(normalizedRoute);

        return engineAdapter;
    });
}
