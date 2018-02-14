#!/usr/bin/env node
const program = require('commander');
const version = require('../../package.json').version;

const setupCallback = require('./setup');
const runCallback = require('./run');
const moduleCallback = require('./module');

program.version(version);

program
    .command('setup')
    .option('--engine', 'the engine adapter that you want')
    .option('--data', 'the driver adapter that you want')
    .action(setupCallback);

program
    .command('module <moduleName>')
    .action(moduleCallback);

program.command('run')
    .option('--configFile', 'Select configs file')
    .option('--routeFile', 'Select routes file')
    .action(runCallback);

program.parse(process.argv);