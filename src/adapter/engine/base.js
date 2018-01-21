const { get, each } = require('lodash');
const { setupPlugin } = require('../../util');

const DEFAULT_ROUTES = {
    '/': {
        'get': 'find',
        'post': 'create',
    },
    '/:id': {
        'get': 'findById',
        'put': 'update',
        'delete': 'delete'
    }
};

const parseMiddleware = name => {
    const config = setupPlugin.getName(name);
    const middle = astronode.middlewares[config.name];

    return setupPlugin.invokeFunction(middle, config.chain);
}

class EngineAdapter {
    static promisedResponse(promise) {
        return (req, res) =>
            promise(req)
                .then(response => res.status(200).json(response))
                .catch(error => res.status(500).json({ error }));
    }

    _interateDefaultRouter(path, config, endpoints, innerPath) {
        const services = config.model ? this._service(config.model) : {};

        each(endpoints, (serviceName, method) => {
            const pathMiddlewaresNames = get(config.middlewares, `${innerPath}.${method}`, []);
            const routeMiddlewareNames = get(config, 'middlewareAll', []);

            const allMiddlewares = routeMiddlewareNames.concat(pathMiddlewaresNames).map(parseMiddleware);

            const cbConfig = setupPlugin.getName(serviceName);
            let promise = get(astronode.controllers, cbConfig.name, services && services[cbConfig.name]);

            if (!promise) {
                throw new Error('@TODO NotAllowedService', serviceName);
            }

            if (cbConfig.chain) {
                promise = setupPlugin.invokeFunction(promise, cbConfig.chain);
            }

            this.createRoute(
                path + innerPath,
                method, allMiddlewares,
                EngineAdapter.promisedResponse(promise)
            );
        });
    }

    _setRoute(config, path) {
        if (config.routes) {
            each(config.routes, this._interateDefaultRouter.bind(this, path, config));
        }

        if (config.defaultApi) {
            if (!config.model) throw new Error('@TODO MissingRouteConfiguration: ', path, 'module');
            each(DEFAULT_ROUTES, this._interateDefaultRouter.bind(this, path, config));
        }
    }

    createRoute(config, path) {
        throw new Error('@TODO: NeedImplementation', path);
    }

    start() {
        throw new Error('@TODO: NeedImplementation');
    }

    setRoutes(routes) {
        each(routes, this._setRoute.bind(this));
    }

    setServices(service) {
        this._service = service;
    }

}

module.exports = EngineAdapter;