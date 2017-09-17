const { attachControllers } = require('../utils/attachControllers');
const mongooseConnector = require('../connector');

const STRATEGY_MAP = {
    'namedModules': require('../utils/namedModules'),
    'indexedModules': require('../utils/indexedModules'),
};

global._RESTOOSEAPPS_ = {};

exports.RestooseApp = (library, opts) => {
    mongooseConnector(opts.mongoUri, opts.mongoOpts);
    return {
        app: library(),
        opts: opts
    }
};

exports.getControllers = (basePath, opts) => {
    const strategyFunc = STRATEGY_MAP[opts.strategy];
        
    if (!strategyFunc) throw new Error('The strategy isn\'t recognized');
    return strategyFunc(basePath, opts.strategyConfig);
}

exports.initServer = (server) => {
    server.controllers.then(controllers => {
        attachControllers(server, controllers);
        server.app.listen(server.opts.port, server.opts.hostname, () => {
            console.log('Server init', server.opts.hostname, server.opts.port);
        });
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });
}

exports.newServer = (name, library, opts) => {
    const app = exports.RestooseApp(library, opts);
    global._RESTOOSEAPPS_[name] = app;
    return app;
}
