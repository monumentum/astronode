const { mapValues, map, get, merge, isString, isArray } = require('lodash');

const Promise = require('bluebird');
const interpreter = require('../../interpreter');

const normalizeRoutes = (routes, config) => mapValues(routes, methods => mapValues(methods, method => {
    let normalizedRoutes = { call: [], middlewares: []};

    if (isString(method)) {
        normalizedRoutes.call.push(method);
    } else if (isArray(method)) {
        normalizedRoutes.call = method;
    } else {
        normalizedRoutes = merge(method, normalizedRoutes);
    }

    if (!isArray(normalizedRoutes.call)) {
        normalizedRoutes.call = [ normalizedRoutes.call ];
    }

    if (!isArray(normalizedRoutes.middlewares)) {
        normalizedRoutes.middlewares = [ normalizedRoutes.middlewares ];
    }

    normalizedRoutes.call = map(normalizedRoutes.call, c => interpreter(c, config, 'controllers'));
    normalizedRoutes.middlewares = map(normalizedRoutes.middlewares, m => interpreter(m, config, 'middlewares'));

    return normalizedRoutes;
}));

const createDefaultRoutes = (dataplugin, model, middlewares) => ({
    '/': {
        'get': {
            'call': [ `!${dataplugin}.methods.find:${model}` ],
            'middlewares': middlewares['/']['get']
        },
        'post': {
            'call': [ `!${dataplugin}.methods.create:${model}` ],
            'middlewares': middlewares['/']['post']
        },
    },
    '/:id': {
        'get': {
            'call': [ `!${dataplugin}.methods.findById:${model}` ],
            'middlewares': middlewares['/:id']['get']
        },
        'put': {
            'call': [ `!${dataplugin}.methods.update:${model}` ],
            'middlewares': middlewares['/:id']['put']
        },
        'delete': {
            'call': [ `!${dataplugin}.methods.delete:${model}` ],
            'middlewares': middlewares['/:id']['delete']
        },
    }
});

const createDefaultMiddlewares = middlewares => merge({
    '/': {
        'get': [],
        'post': [],
    },
    '/:id': {
        'get': [],
        'put': [],
        'delete': []
    }
}, middlewares);

const createAuthRoutes = name => ({
    '/': {
        'post': `${name}.login`
    },
    '/:id': {
        'delete': {
            'call': [ `${name}.logout` ],
            'middleware': `${name}:isMe`
        },
        'update': {
            'call': [ `${name}.refresh` ],
            'middleware': `${name}:isMe`
        }
    }
});

exports.configureSession = config => {
    const authentication = get(config, 'opts.authentication');

    if (authentication) {
        authentication.tokenActions = mapValues(authentication.tokenActions, (value) => interpreter(value, config, 'plugins'));

        const wrapper = interpreter(authentication.middlewares, config, 'plugins');
        const middleware = config.plugins[config.opts.engine].authenticationMiddleware(authentication.tokenActions.check);
        const controller = config.plugins[config.opts.engine].authenticationController(authentication, config);

        config.middlewares[authentication.name] = wrapper(middleware);
        config.controllers[authentication.name] = controller;
        const routes = createAuthRoutes(authentication.name);

        if (!authentication.tokenActions.refresh) {
            delete routes['/:id'];
        }

        config.routes[authentication.api.uri] = normalizeRoutes(routes, config);
    }

    return Promise.resolve(config);
};

exports.configureRoute = (routes, config) => mapValues(require(routes), route => {
    const defaultApiModel = get(route, 'defaultAPI.model');
    let subroutes = {};

    if (defaultApiModel) {
        const middlewares = createDefaultMiddlewares(route.defaultAPI.middlewares);
        subroutes = createDefaultRoutes(config.opts.data, defaultApiModel, middlewares);
    }

    return merge(
        normalizeRoutes(subroutes, config),
        normalizeRoutes(route.routes, config)
    );
});