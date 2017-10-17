jest.mock('../connector');
jest.mock('../utils');

const Promise = require('bluebird');
const utils = require.requireMock('../utils');
const { Connector } = require.requireMock('../connector');

const appPackage = require('./');

const FAKE_PATH = 'FAKE_PATH';
const FAKE_ERR = 'FAKE_ERR';
const CNTRL_OPTS = {
    strategy: 'namedModules',
    strategyConfig: 'FAKE_STRATEGY_CONFIG'
};

describe('(restoose) App', () => {
    let mockedServer = {
        app: {
            listen: jest.fn()
        },
        opts: {
            port: 'PORT',
            hostname: 'HOSTNAME',
        }
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should exec correctly RestooseApp', () => {
        Connector.mockReturnValue('');
        const fakeApp = 'FAKE_APP';
        const lib = jest.fn().mockReturnValue(fakeApp);
        const opts = {
            mongoUri: 'TEST_MONGO_URI',
            mongoOpts: 'TEST_MONGO_OPTS',
        };

        const app = appPackage.RestooseApp(lib, opts);

        expect(app).toHaveProperty('app', fakeApp);
        expect(app).toHaveProperty('opts', opts);
        expect(Connector).toHaveBeenCalledWith(opts.mongoUri, opts.mongoOpts);
        expect(Connector).toHaveBeenCalledTimes(1);
        expect(lib).toHaveBeenCalledTimes(1);
    });

    it('should exec getController with success', () => {
        utils.namedModules.mockReturnValue(Promise.resolve());

        return appPackage.getControllers(FAKE_PATH, CNTRL_OPTS).then(() => {
            expect(utils.namedModules).toHaveBeenCalledWith(
                FAKE_PATH, CNTRL_OPTS.strategyConfig
            );
        });
    });

    it('should throw a err on getController ', done => {
        appPackage.getControllers(FAKE_PATH, {}).catch(err => {
            expect(err).toBe('The strategy isn\'t recognized');
            done();
        });
    });

    it('should exec initServer correctly', () => {
        const controllers = 'CONTROLLERS';
        mockedServer.controllers = Promise.resolve(controllers);
        utils.attachControllers.mockReturnValue();

        return appPackage.initServer(mockedServer).then(() => {
            const args = mockedServer.app.listen.mock.calls[0];

            expect(utils.attachControllers).toHaveBeenCalledWith(mockedServer, controllers);
            expect(args[0]).toBe(mockedServer.opts.port);
            expect(args[1]).toBe(mockedServer.opts.hostname);
        });
    });

    it('should throw exception correctly in initServer', done => {
        mockedServer.controllers = Promise.reject(FAKE_ERR);
        appPackage.initServer(mockedServer).catch(err => {
            expect(err.message).toBe(FAKE_ERR);
            done();
        });
    });

    it('should create a new server', () => {
        const FAKE_APP = 'FAKE_APP';
        const FAKE_NAME = 'test_name';
        const FAKE_LIB = 'express';
        const FAKE_OPTS = '{}';
        jest.spyOn(appPackage, 'RestooseApp').mockReturnValue(FAKE_APP);
        const app = appPackage.newServer(FAKE_NAME, FAKE_LIB, FAKE_OPTS);

        expect(app).toBe(FAKE_APP);
        expect(global._RESTOOSEAPPS_).toHaveProperty(FAKE_NAME, FAKE_APP);
        expect(appPackage.RestooseApp).toHaveBeenCalledWith(FAKE_LIB, FAKE_OPTS);
    });
});