const { mapValues, map, get, merge, isString, isArray } = require('lodash');
const interpreter = require('../../interpreter');

const normalizeRoutes = (routes, config) => mapValues(routes, methods => mapValues(methods, method => {
    let normalizedRoutes = { call: [], middlewares: []};

    if (isString(method)) {
        normalizedRoutes.call.push(method);
    } else if (isArray(method)) {
        normalizedRoutes.call = method;
    } else {
        normalizedRoutes = method;
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
            'middlewares': middlewares['/']['get']
        },
        'put': {
            'call': [ `!${dataplugin}.methods.update:${model}` ],
            'middlewares': middlewares['/']['put']
        },
        'delete': {
            'call': [ `!${dataplugin}.methods.delete:${model}` ],
            'middlewares': middlewares['/']['delete']
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

const createAuthRoutes = (path, name) => ({
    [path]: {
        '/': {
            'post': `${name}.login`
        },
        '/:id': {
            'delete': {
                'call': `${name}.logout`,
                'middleware': `${name}:isMe`
            },
            'update': {
                'call': `${name}.refresh`,
                'middleware': `${name}:isMe`
            }
        }
    }
});

module.exports = (routes, config) => mapValues(routes, route => {
    let subroutes = {};
    let authroutes = {};

    const defaultApiModel = get(route, 'defaultAPI.model');
    const authentication = get(config, 'opts.authentication');

    if (authentication) {
        const authCheck = interpreter(authentication.tokenActions.check, config, 'plugins');
        const middleCreator = config.plugins[config.opts.engine].authMiddleware;

        authroutes = createAuthRoutes(authentication);
        config.middlewares[authentication.name] = middleCreator.bind(null, authCheck);
    }

    if (defaultApiModel) {
        const middlewares = createDefaultMiddlewares(defaultApiModel.middlewares);
        subroutes = createDefaultRoutes(config.opts.data, defaultApiModel, middlewares);
    }

    return merge(
        normalizeRoutes(subroutes, config),
        normalizeRoutes(route.routes, config),
        authroutes
    );
});