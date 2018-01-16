jest.mock('../src/adapter');
jest.mock('../src/util');

const main = require('../src/index');
const util = require.requireMock('../src/util');
const adapter = require.requireMock('../src/adapter');

const config = require('../config.jest.json');

describe('src.index', () => {
    const root = 'TEST_MOCK';

    beforeEach(() => {
        util.normalizeProcessVariables.mockReturnValue(config);
    });

    it('should run .runAstronaut', () => {
        main.runAstronaut({ configFile: 'config.jest.json', routeFile: 'config.jest.json'});
        expect(util.normalizeProcessVariables).toHaveBeenCalledWith(config);
        expect(adapter.mountApp).toHaveBeenCalledWith(config, config);
    });
});