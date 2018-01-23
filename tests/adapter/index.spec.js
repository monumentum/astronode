jest.mock('../../src/register');

const Promise = require('bluebird');
const adapter = require('../../src/adapter');

const {
    registerModules,
    registerMiddleware,
    registerPlugins,
} = require.requireMock('../../src/register');

const setRouteSpec = jest.fn();
class TestAdapter {
    constructor() {
        this.isEngineTest = true;
    }

    setRoutes(args) {
        return setRouteSpec(args);
    }
}

describe('src/adapter/index', () => {
    beforeEach(() => {
        registerModules.mockReturnValue(Promise.resolve());
        registerPlugins.mockReturnValue(Promise.resolve());
        registerMiddleware.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should setupApp with all registers', () => {
        const fakeConfig = {
            plugins: [],
            application: {
                modules: {},
                middlewares: {},
            }
        };

        return adapter.setupApp(fakeConfig).then(() => {
            expect(registerModules).toHaveBeenCalledWith(fakeConfig);
            expect(registerPlugins).toHaveBeenCalledWith(fakeConfig);
            expect(registerMiddleware).toHaveBeenCalledWith(fakeConfig);
        });
    });

    it('should setupApp without middlewares without non-required registers', () => {
        const fakeConfig = {
            application: {
                modules: {},
            }
        };

        return adapter.setupApp(fakeConfig).then(() => {
            expect(registerModules).toHaveBeenCalledWith(fakeConfig);
            expect(registerPlugins).not.toHaveBeenCalledWith(fakeConfig);
            expect(registerMiddleware).not.toHaveBeenCalledWith(fakeConfig);
        });
    });

    it('should setupApp without middlewares without required registers', () => {
        const fakeConfig = {};

        return adapter.setupApp(fakeConfig).catch(error => {
            expect(registerModules).not.toHaveBeenCalledWith(fakeConfig);
            expect(registerPlugins).not.toHaveBeenCalledWith(fakeConfig);
            expect(registerMiddleware).not.toHaveBeenCalledWith(fakeConfig);
        });
    });

    it('should mountApp correctly', () => {
        const config = { engine: 'TEST_ENGINE' };
        const route = 'TEST_ROUTE';

        global.astronode = { plugins: { [config.engine]: new TestAdapter() } }
        adapter.setupApp = jest.fn().mockReturnValue(Promise.resolve());

        return adapter.mountApp(config, route).then(engine => {
            expect(setRouteSpec).toHaveBeenCalledWith(route);
            expect(engine).toHaveProperty('isEngineTest');
        });
    });
});