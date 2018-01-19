const Promise = require('bluebird');
const { registerModules, registerMiddleware } = require('../register');

const ENGINES = require('./engine');
const DRIVERS = require('./driver');

const getInstance = (mapper, name, config) => new mapper[name](config);

exports.getDriver = ({ driver, driverConfig }) => getInstance(DRIVERS, driver, driverConfig);
exports.getEngine = ({ engine, engineConfig }) => getInstance(ENGINES, engine, engineConfig);

exports.setupApp = (driver, config) => Promise.all([
    driver.start(),
    config.modules ? registerModules(config) : Promise.resolve(),
    config.middlewares ? registerMiddleware(config) : Promise.resolve(),
]);

exports.mountApp = (normalizedConfig, normalizedRoute)  => {
    const driverAdapter = exports.getDriver(normalizedConfig);
    const engineAdapter = exports.getEngine(normalizedConfig);

    return exports.setupApp(driverAdapter, normalizedConfig)
        .then(() => {
            engineAdapter.setServices(driverAdapter.services);
            engineAdapter.setRoutes(normalizedRoute);

            return engineAdapter;
        });
};

exports.dependenciesMap = {
    express: ['express', 'body-parser'],
    mongoose: ['mongoose']
}
