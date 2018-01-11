const { get, each } = require('lodash');

const DEFAULT_ROUTES = {
    "/": {
        "get": "find",
        "post": "create",
    },
    "/:id": {
        "get": "findById",
        "put": "update",
        "delete": "delete"
    }
};

class EnginerAdapter {
    static promisedResponse(promise) {
        return (req, res) =>
            promise(req)
            .then(response => res.status(200).json(response))
            .catch(error => res.status(500).json({ error }))
    }

    _interateDefaultRouter(path, config, endpoints, innerPath) {
        const services = this._service(config.model);

        each(endpoints, (serviceName, method) => {
            const pathMiddle = get(config.middlewares, `${innerPath}.${method}`, [])
                .map(name => astronaut.middlewares[name]);

            this.createRoute(
                path + innerPath,
                method, pathMiddle,
                EnginerAdapter.promisedResponse(services[serviceName])
            );
        });
    }

    _setRoute(config, path) {
        if (config.defaultRoutes) {
            if (!config.model) throw new MissingRouteConfiguration(path, 'module');
            each(DEFAULT_ROUTES, this._interateDefaultRouter.bind(this, path, config));
        }
    }

    createRoute(config, path) {
        throw new NeedImplementation();
    }

    start() {
        throw new NeedImplementation();
    }

    setRoutes(routes) {
        each(routes, this._setRoute.bind(this));
    }

    setServices(service) {
        this._service = service;
    }

}

module.exports = EnginerAdapter;