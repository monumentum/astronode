const fs = require('fs');

const astronautConfig = {
    port: 3000,
    host: '0.0.0.0',
    engine: '',
    data: '',
    application: {
        modules: 'app',
        controllerPattern: '/controller.js$',
        modelPattern: '/model.js$',
        ignored: []
    },
};

module.exports = (engine, driver) => {
    astronautConfig.engine = engine;
    astronautConfig.driver = driver;

    const configFile = `${process.cwd()}/astronode.config.json`;
    const configJson = JSON.stringify(astronautConfig, null, 4);

    fs.writeFile(configFile, configJson, err => {
        if (err) process.exit(err);
        process.exit();
    });
};