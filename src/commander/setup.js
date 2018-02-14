const fs = require('fs');
const moduleFolder = 'app';

const astronautConfig = {
    port: 3000,
    host: '0.0.0.0',
    engine: '',
    data: '',
    application: {
        modules: moduleFolder,
        controllerPattern: '/controller.js$',
        modelPattern: '/model.js$',
        ignored: []
    },
    plugins: []
};

const basePlugin = name => ({
    name, module: name
});

const dataPlugin = name => Object.assign(basePlugin(name), {
    config: {
        uri: 'localhost',
        port: 1111,
        database: 'astronode'
    }
});

module.exports = (engine, data) => {
    astronautConfig.engine = engine;
    astronautConfig.data = data;

    astronautConfig.plugins.push(basePlugin(engine));
    astronautConfig.plugins.push(dataPlugin(data));

    const configFile = `${process.cwd()}/astronode.config.json`;
    const configJson = JSON.stringify(astronautConfig, null, 4);


    fs.writeFile(configFile, configJson, err => {
        if (err) process.exit(err);
        fs.mkdirSync(`${process.cwd()}/${moduleFolder}`);
        process.exit();
    });
};