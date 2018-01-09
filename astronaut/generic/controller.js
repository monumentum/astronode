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

const interateMethods = (app, parser, middleware) =>
    (path, method, callbackName) => {
        const middlewares = middleware[method];
        parser(app, path, method, exports.promiseController(services[callbackName]), middleware);
    }

exports.promiseController = promise => (req, res) =>
    promise(req)
        .then(response => res.status(200).json(response))
        .catch(error => res.status(500).json({ error }));

exports.injectOnApp = (app, parser, middlewares) => {
    const interator = interateMethods(app, parser, middleware);

    each(DEFAULT_ROUTES, (methods, path) =>
        each(methods, (callbackName, method) => interator(path, method, callbackName)
    ));
}