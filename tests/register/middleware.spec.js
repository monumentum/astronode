jest.mock('../../src/util');

const Promise = require('bluebird');
const fakeLoad = require('../__mocks__/middleware');
const { registerMiddleware } = require('../../src/register');
const { fs, getFileName } = require.requireMock('../../src/util');

describe('Register Middleware', () => {
    const fakeName = 'middleware.js';
    astronode = {
        ROOT_PATH: process.cwd() + '/tests/__mocks__',
        middlewares: {}
    }

    beforeEach(() => {
        const mockPath = `${astronode.ROOT_PATH}/${fakeName}`;
        const promiseWithFiles = Promise.resolve([mockPath]);
        fs.recursiveDir.mockReturnValue(promiseWithFiles)
        getFileName.mockReturnValue(fakeName);
    });

    it('should exec middleware register correctly', () => {
        return registerMiddleware({ application: { middlewares: '' }}).then(() => {
            expect(astronode.middlewares[fakeName]).toBe(fakeLoad);
        });
    });
});