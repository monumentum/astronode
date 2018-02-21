const { configureSession, configureRoute } = require('../../../src/configuration/parser/router');
const fakeDataEngine = require('../../__mocks__/engine/data');

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

    it('should configure authentication', () => {
        const middle = 'MIDDLEWARE_FAKE';
        const engine = 'test';
        const uri = '/testauth';
        const authName = 'authTest';
        const fakePlugin = {
            name: 'someauthplug',
            fn: jest.fn()
        };

        const auth = {
            name: authName,
            methods: {
                create: 'create',
                check: 'check',
                middlewares: 'middleware'
            },
            responses: {
                create: 'CREATE_RESP',
                check: 'CHECK_RESP',
                middlewares: 'MIDDLE_RESP',
            },
            method: function (name) {
                return `!${this.name}.${this.methods[name]}`;
            }
        };

        const fakeAuthPlugin = {
            [auth.methods.create]: jest.fn().mockReturnValue(auth.responses.create),
            [auth.methods.check]: jest.fn().mockReturnValue(auth.responses.check),
            [auth.methods.middlewares]: jest.fn().mockReturnValue(auth.responses.middlewares),
        };

        const authentication = {
            name: authName,
            api: {
                uri: uri,
                modelGetter: '!' + fakePlugin.name,
                fieldsToCheck: [ 'email', 'password']
            },
            tokenActions: {
                create: auth.method('create'),
                check: auth.method('check')
            },
            middlewares: auth.method('middlewares'),
        };

        const fakeCtrl = {
            login: jest.fn(),
            logout: jest.fn(),
        };

        const fakeEngine = {
            authenticationMiddleware: jest.fn().mockReturnValue(middle),
            authenticationController: jest.fn().mockReturnValue(fakeCtrl),
        };

        const fakeConfig = {
            opts: {
                engine,
                authentication
            },
            plugins: {
                [engine]: fakeEngine,
                [auth.name]: fakeAuthPlugin,
                [fakePlugin.name]: fakePlugin.fn
            },
            middlewares: {},
            controllers: {},
            routes: {}
        };

        return configureSession(fakeConfig).then(config => {
            const expectedRoute = config.routes[uri]['/']['post'];
            expect(expectedRoute.call[0]).toBeTruthy();
            expect(expectedRoute.middlewares).toEqual([]);
        });
    });

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
        };

        const parsedRoutes = configureRoute(routeConfig, fakeConfig);
        const expected = {
            '/default': {
                '/': {
                    'get': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': [ fakeGetMiddleware.call.bind(fakeGetController)]
                    },
                    'post': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    }
                },
                '/:id': {
                    'get': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    },
                    'put': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    },
                    'delete': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    }
                }
            },
            '/custom': {
                '/': {
                    'get': {
                        'call': [ fakeGetController.call.bind(fakeGetController) ],
                        'middlewares': [ ]
                    }
                }
            },
            '/override': {
                '/': {
                    'get': {
                        'call': [ fakeGetController.call.bind(fakeGetController) ],
                        'middlewares': [ fakeGetMiddleware.call.bind(fakeGetController) ]
                    },
                    'post': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    }
                },
                '/:id': {
                    'get': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    },
                    'put': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    },
                    'delete': {
                        'call': [ fakeDataEngine.fakeReturn.bind(fakeDataEngine) ],
                        'middlewares': []
                    }
                }
            }
        };

        expect(JSON.stringify(parsedRoutes)).toBe(JSON.stringify(expected));
    });
});