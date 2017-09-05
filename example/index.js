const express = require('express');
const Restoose = require('restoose');

const app = new Restoose(express, {
    hostname: '0.0.0.0',
    port: 3000
});

restoose.loadModules('./modules', {
    ignoreFolder: ['tests'],
    controller: 'controller.js',
    model: 'model.js',
    initControllerIfNotFound: true,
    recursiveRoute: 2
});

app.init();