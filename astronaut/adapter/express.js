function expressAdapter() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    this.app = app;
}

expressAdapter.routeMapper = function (router, path, method, callback, middleware = []) {
    router[method](path, middleware, callback);
}

expressAdapter.insertRoutes = function (routes) {
    each(routes, (config, path) => {
        const router = express.Router();

        if (config.middlewareAll)
            router.all(getMiddleware(config.middlewareAll));

        if (config.defaultRoute)
            controller.injectOnApp(router, expressAdapter.routeMapper, config.middleware);

        this.app.use(path, router);
    });
}

module.exports = expressAdapter;