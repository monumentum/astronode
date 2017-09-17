const express = require('express');
const bodyParser = require('body-parser');

const { newServer, initServer, getControllers } = require('../restoose/app');

const server = newServer('myApplication', express, {
    hostname: process.env.IP,
    port: process.env.PORT,
    globalMiddlewares: [],
    mongoUri: 'mongodb://localhost:27017/restoose-example',
    coreHandler: (modelResponse, res) => {
        modelResponse.then(result => {
            res.status(200).json({ result });
        }).catch(error => {
            res.status(400).json({ error });
        });
    }
});

server.app.use(bodyParser.json())

server.controllers = getControllers('modules', {
    autoEndpointForModels: true,
    recursiveRoute: 2,
    middlewareModule: 'core/middlewares/index.js',
    strategy: 'namedModules',
    strategyConfig: { 
        ignoreFolders: ['tests'],
        controllerPattern: 'controller.js',
        modelPattern: 'model.js',
    }
});

// app.loadModules('./modules', {
//     autoEndpointForModels: true,
//     recursiveRoute: 2,
//     middlewareModule: 'core/middlewares/index.js',
//     strategy: 'indexedModules',
//     strategyConfig: {
//         controllerFile: 'controllers/index.js',
//         modelFile: 'models/index.js'
//     },
// });


initServer(server);