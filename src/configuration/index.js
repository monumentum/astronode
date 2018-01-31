const StarMap = require('star-mapper');
const starMap = new StarMap({
    rootPath: process.cwd(),
    opts: {},
    middlewares: {},
    controllers: {},
    models: {},
    plugins: {},
    routes: {}
});

const getConfig = (configFile, routerFile) => {
    starMap
        .parsex(configFile, {
            star: 'opts',
            strategy: require('./parser/config')
        })
        .parsex('> opts.application.middlewares', {
            wait: [ 'opts' ],
            star: 'middlewares',
            strategy: require
        })
        .parsex('> opts.application.modules', {
            wait: [ 'opts' ],
            constelation: [
                { star: 'models', strategy: require, skip: '> opts.application.controllerPattern' },
                { star: 'controllers', strategy: require, skip: '> opts.application.modelPattern' },
            ]
        })
        .parsex('> opts.plugins', {
            wait: [ 'opts' ],
            star: 'plugins',
            strategy: require('./parser/plugins')
        })
        .parsex(routerFile, {
            wait: [ 'modules', 'middlewares', 'plugins' ],
            star: 'routes',
            strategy: require('./parser/router')
        });

    return starMap.bigbang();
};

module.exports = getConfig;