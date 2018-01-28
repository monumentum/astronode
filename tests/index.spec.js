jest.mock('../src/configuration');

const main = require('../src/index');
const getConfig = require.requireMock('../src/configuration');

describe('src.index', () => {
    const fakeConfig = 'FAKE_CONFIG';
    const fakeRoute = 'FAKE_ROUTE';

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should exec mountApp correctly', () => {
        const engineProp = 'TEST';

        const fakeEngine = {
            _testEngine: true,
            setRoutes: jest.fn(),
        };

        const fakeReponseConfig = {
            plugins: { [engineProp]: fakeEngine },
            routes: { 'foo': 'bar' },
            opts: { engine: engineProp }
        };

        getConfig.mockReturnValue(Promise.resolve(fakeReponseConfig));

        return main.mountApp(fakeConfig, fakeRoute).then(engine => {
            expect(getConfig).toHaveBeenCalledWith(fakeConfig, fakeRoute);
            expect(engine).toHaveProperty('_testEngine');
            expect(engine.setRoutes).toHaveBeenCalledWith(fakeReponseConfig.routes);
        });
    });

    it('should exec runServerFunction correctly', () => {
        const fakeAdapter = { start: jest.fn() };

        main.initServer(fakeAdapter);
        expect(fakeAdapter.start).toHaveBeenCalledWith();
    });

    it('should exec initServer correctly', () => {
        const fakeAdapter = { start: jest.fn() };

        main.initServer(fakeAdapter);
        expect(fakeAdapter.start).toHaveBeenCalledWith();
    });

    it('should exec runAstronode correctly', () => {
        main.initServer = jest.fn().mockReturnValue(Promise.resolve());
        main.mountApp = jest.fn().mockReturnValue(Promise.resolve());

        return main.runAstronode({
            configFile: fakeConfig,
            routeFile: fakeRoute
        }).then(() => {
            expect(main.initServer).toHaveBeenCalledTimes(1);
            expect(main.mountApp).toHaveBeenCalledWith(fakeConfig, fakeRoute);
        });
    });

    it('should exec runAstronode correctly', () => {
        return main.runAstronode({}).then(() => {
            expect(main.initServer).toHaveBeenCalledTimes(1);
            expect(main.mountApp).toHaveBeenCalledWith('astronode.config.json', 'astronode.routes.json');
        });
    });
});