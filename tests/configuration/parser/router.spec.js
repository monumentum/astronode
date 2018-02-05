const { configureSession, configureRoute } = require('../../../src/configuration/parser/router');
const fakeDataEngine = require('../../__mocks__/engine/data');
const { isEqual } = require('lodash');

const fakeGetController = {
    key: 'fakeGetCtrl',
    call: () => false
};

const fakeGetMiddleware = {
    key: 'fakeGetMiddleware',
    call: () => false
};

const routeConfig = `${process.cwd()}/tests/__mocks__/router.mock.json`;

describe('Configuration > Parse Plugins', () => {
    it('should map routes correctly', () => {
        const dataEngine = 'test';
        const engineTest = 'test';
        const fakeConfig = {
            controllers: {
                [fakeGetController.key]: fakeGetController.call
            },
            middlewares: {
                [fakeGetMiddleware.key]: fakeGetMiddleware.call
            },
            opts: {
                engine: engineTest,
                data: dataEngine,
            },
            plugins: {
                [ dataEngine ]: fakeDataEngine
            }
        }

        const parsedRoutes = configureRoute(routeConfig, fakeConfig);
        const expected = {
            '/default': {
                '/': {
                    'get': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': [ fakeGetMiddleware.call ]
                    },
                    'post': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    }
                },
                '/:id': {
                    'get': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    },
                    'put': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    },
                    'delete': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    }
                }
            },
            '/custom': {
                '/': {
                    'get': {
                        'call': [ fakeGetController.call ],
                        'middlewares': [ ]
                    }
                }
            },
            '/override': {
                '/': {
                    'get': {
                        'call': [ fakeGetController.call ],
                        'middlewares': [ fakeGetMiddleware.call ]
                    },
                    'post': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    }
                },
                '/:id': {
                    'get': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    },
                    'put': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    },
                    'delete': {
                        'call': [ fakeDataEngine.fakeReturn ],
                        'middlewares': []
                    }
                }
            }
        };

        expect(parsedRoutes).toEqual(expected);
    });
});