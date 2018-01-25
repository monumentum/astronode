jest.mock('../../src/util');

const Promise = require('bluebird');
const fakeControllerLoad = require('../__mocks__/controller');
const fakeModelLoad = require('../__mocks__/model');

const { registerModules } = require('../../src/register');
const { fs, getModuleName } = require.requireMock('../../src/util');

describe('Register Modules', () => {
    const fakeController = 'controller.js';
    const fakeModel = 'model.js';
    const fakeModule = 'test';
    const fakeApplicationConfig = {
        ignoredPaths: [],
        modules: 'app',
        controllerPattern: fakeController,
        modelPattern: fakeModel
    }

    astronode = {
        MODULES_PATH: process.cwd() + '/tests/__mocks__',
        controllers: {},
        models: {},
    }

    beforeEach(() => {
        const mockPath = astronode.MODULES_PATH;
        const mockPathController = `${astronode.MODULES_PATH}/${fakeController}`;
        const mockPathModel = `${astronode.MODULES_PATH}/${fakeModel}`;
        const promiseWithFiles = Promise.resolve([
            mockPathController, mockPathModel, mockPath
        ]);

        fs.recursiveDir.mockReturnValue(promiseWithFiles)
        getModuleName
            .mockReturnValueOnce(fakeModule)
            .mockReturnValueOnce(fakeModule)
            .mockReturnValueOnce(null);
    });

    it('should exec module register correctly', () => {
        return registerModules({ application: fakeApplicationConfig }).then(() => {
            expect(getModuleName).toHaveBeenCalledTimes(3);
            expect(astronode.controllers[fakeModule]).toBe(fakeControllerLoad);
            expect(astronode.models[fakeModule]).toBe(fakeModelLoad);
        });
    });
});