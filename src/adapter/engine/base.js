const { get, each } = require('lodash');

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
            const pathMiddle = get(config.middlewares, `${innerPath}.${method}`, [])
                .map(name => astronaut.middlewares[name]);

            const promise = get(astronaut.controllers, serviceName, services && services[serviceName]);

            if (!promise) {
                throw new Error('@TODO NotAllowedService', serviceName);
            }

            this.createRoute(
                path + innerPath,
                method, pathMiddle,
                EngineAdapter.promisedResponse(promise)
            );
        });
    }

    _setRoute(config, path) {
        if (config.routes) {
            each(config.routes, this._interateDefaultRouter.bind(this, path, config));
        }

        if (config.defaultRoutes) {
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