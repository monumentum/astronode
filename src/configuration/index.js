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
            parser: require('./parser/config')
        })
        .parsex('> config.application.middlewares', {
            wait: [ 'config' ],
            star: 'middlewares',
            parser: require
        })
        .parsex('> config.application.modules', {
            wait: [ 'config' ],
            constelation: [
                { star: 'models', pattern: '> config.application.modelPattern' },
                { star: 'controllers', pattern: '> config.application.controllerPattern' },
            ]
        })
        .parsex('> config.plugins', {
            wait: [ 'config' ],
            star: 'plugins',
            parser: require('./parser/plugins')
        })
        .parsex(routerFile, {
            wait: [ 'modules', 'middlewares', 'plugins' ],
            star: 'routes',
            parser: require('./parser/router')
        })

    return starMap.bigbang();
}

module.exports = getConfig;