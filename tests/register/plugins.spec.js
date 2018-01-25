jest.mock('../../src/util');

const Promise = require('bluebird');
const fakePluginClass = require('../__mocks__/plugins/fake-class');
const fakePluginFn = require('../__mocks__/plugins/fake-fn');

const { registerPlugins } = require('../../src/register');
const { WrongType } = require('astronode-utils/lib/error');

describe('Register Plugins', () => {
    const fakeClassName = 'classPlugin';
    const fakeFnName = 'fnPlugin';
    const fakeFnNameWConfig = 'fnPluginWConfig';
    const fakeWrongPlugin = 'fakeWrongPlugin';
    const fnConfig = { test: 1 };

    global.astronode = {
        ROOT_PATH: process.cwd() + '/tests/__mocks__/plugins',
        plugins: {}
    }

    const plugins = [
        { name: fakeClassName, module: `${astronode.ROOT_PATH}/fake-class` },
        { name: fakeFnName, module: `${astronode.ROOT_PATH}/fake-fn` },
        { name: fakeFnNameWConfig, module: `${astronode.ROOT_PATH}/fake-fn`, config: fnConfig},
    ];

    it('should exec plugins register correctly', () => {
        return registerPlugins({ plugins }).then(() => {
            expect(astronode.plugins[fakeClassName]._autoinitialize).toHaveBeenCalled();
            expect(astronode.plugins[fakeClassName]).toHaveProperty('isPluginClass');
            expect(astronode.plugins[fakeFnName]()).toBe(fakePluginFn());
            expect(astronode.plugins[fakeFnNameWConfig]).toBe(fakePluginFn(fnConfig));
        });
    });

    it('should throw exception loading plugins', () => {
        const plugins = [{ name: fakeWrongPlugin, module: `${astronode.ROOT_PATH}/fake-wrong` }];
        return registerPlugins({ plugins }).catch(err => {
            expect(err).toBeInstanceOf(WrongType);
        });
    });
});