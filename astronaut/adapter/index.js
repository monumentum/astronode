const { registerModules, registerMiddleware } = require('./register');

exports.express = require('./express');

exports.selectEngine = engineName => {
    if (exports[engineName]) throw new Error();
    return exports[engineName]();
}

exports.mountApp = function (libName, normalizedConfig, normalizedRoute) {
    const controllers = registerModules(normalizedConfig.modulesFolder);
    const middlewares = registerMiddleware(normalizedConfig.middlewareFolder);

    exports.selectEngine(libName, normalizeConfig);
    adapter.insertRoutes(normalizedRoute);

    return adapter.app;
}