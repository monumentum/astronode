jest.mock('../../src/register');
jest.mock('../../src/adapter/driver');
jest.mock('../../src/adapter/engine');

const Promise = require('bluebird');
const register = require.requireMock('../../src/register');

class TestDriverAdapter {
    constructor() {
        this.isDriver = true;
    }
}

class TestEngineAdapter {
    constructor() {
        this.isEngine = true;
    }
}

describe('src/adapter/index', () => {
    let adapter;
    const driverFake = {
        start: jest.fn().mockReturnValue(Promise.resolve())
    }

    const engineFake = {
        __IS_FAKE__: true,
        setServices: jest.fn(),
        setRoutes: jest.fn()
    }

    beforeEach(() => {
        adapter = require('../../src/adapter');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('#getInstance', () => {
        const adapterName = 'testAdapter';
        const driverMock = require.requireMock('../../src/adapter/driver');
        const engineMock = require.requireMock('../../src/adapter/engine');

        driverMock[adapterName] = TestDriverAdapter;
        engineMock[adapterName] = TestEngineAdapter;

        it('should call #getDriver correctly', () => {
            const driver = adapter.getDriver({ driver: adapterName });
            expect(driver).toHaveProperty('isDriver');
            expect(driver).not.toHaveProperty('isEngine');
        });

        it('should call #getEngine correctly', () => {
            const engine = adapter.getEngine({ engine: adapterName });
            expect(engine).not.toHaveProperty('isDriver');
            expect(engine).toHaveProperty('isEngine');
        });
    });

    describe('#mountApp', () => {
        beforeEach(() => {
            adapter.getDriver = jest.fn().mockReturnValue(driverFake);
            adapter.getEngine = jest.fn().mockReturnValue(engineFake);
            adapter.setupApp = jest.fn().mockReturnValue(Promise.resolve());
        });

        it('should exec #mountApp correctly', () => {
            const config = 'FAKE_CONFIG';
            const routes = 'FAKE_ROUTES';

            return adapter.mountApp(config, routes).then(app => {
                expect(adapter.getDriver).toHaveBeenCalledWith(config);
                expect(adapter.getEngine).toHaveBeenCalledWith(config);
                expect(adapter.setupApp).toHaveBeenCalledWith(driverFake, config);
                expect(app.setServices).toHaveBeenCalledWith(driverFake.services);
                expect(app.setRoutes).toHaveBeenCalledWith(routes);
                expect(app).toHaveProperty('__IS_FAKE__', true);
            });
        });
    });
});