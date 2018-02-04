const StarMap = require('star-mapper');
const pluginParser = require('./parser/plugins');

const starMap = new StarMap({
    rootPath: process.cwd(),
    opts: {},
    middlewares: {},
    controllers: {},
    models: {},
    plugins: {},
    routes: {}
});

module.exports = (configFile, routerFile) => {
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
                { star: 'models', strategy: require, only: '> opts.application.modelPattern' },
                { star: 'controllers', strategy: require, only: '> opts.application.controllerPattern' },
            ]
        })
        .parsex('> opts.plugins', {
            wait: [ 'opts' ],
            star: 'plugins',
            strategy: pluginParser.configurePlugins
        })
        .parallax(pluginParser.runPlugins)
        .parsex(routerFile, {
            wait: [ 'modules', 'middlewares', 'plugins' ],
            star: 'routes',
            strategy: require('./parser/router')
        });

    return starMap.bigbang();
};