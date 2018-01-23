const { exec } = require('child_process');
const { dependenciesMap } = require('../adapter');
const { fs } = require('../util');

const astronautConfig = {
    port: 3000,
    host: '0.0.0.0',
    engine: '',
    driver: '',
    driverConfig: {},
    modules: {
        root: 'app',
        controllerPattern: '/controller.js$',
        modelPattern: '/model.js$',
        ignored: []
    },
};

module.exports = (engine, driver) => {
    astronautConfig.engine = engine;
    astronautConfig.driver = driver;

    const deeps = dependenciesMap[engine].concat(dependenciesMap[driver]);
    const configFile = `${astronode.ROOT_PATH}/astronode.config.json`;
    const configJson = JSON.stringify(astronautConfig, null, 4);

    exec(`npm install --save ${deeps.join(' ')}`, err => {
        if (err) throw err;

        fs.writeFile(configFile, configJson)
            .then(() => process.exit(0));
    });
};