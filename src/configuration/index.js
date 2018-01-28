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
        .parsex('> application.middlewares', {
            wait: [ 'config' ],
            star: 'middlewares',
            strategy: require
        })
        .parsex('> application.modules', {
            wait: [ 'config' ],
            constelation: [
                { star: 'models', strategy: require, skip: '> application.modelPattern' },
                { star: 'controllers', strategy: require, skip: '> application.controllerPattern' },
            ]
        })
        .parsex('> plugins', {
            wait: [ 'config' ],
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