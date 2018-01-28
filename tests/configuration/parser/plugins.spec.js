const parsePlugins = require('../../../src/configuration/parser/plugins');
const mockdir = dir => `${process.cwd()}/tests/__mocks__/${dir}`;
const pluginGetter = parsedPlugins => name => parsedPlugins[name];
const { WrongType } = require('astronode-utils/lib/error');

const originalFn = require(mockdir('plugins/fake-fn'));

describe('Configuration > Parse Plugins', () => {
    const fakeFnPlugin = 'fakeFnPlugin';
    const fakeClassPlugin = 'fakeClassPlugin';
    const fakeWrongPlugin = 'fakeWrongPlugin';
    const fakeFnPluginWithConfig = 'fakeFnPluginWithConfig';
    const fakeFnPluginConfig = {
        test: 2
    };

    const fakePlugins = [
        {
            name: fakeFnPlugin,
            module: mockdir('plugins/fake-fn'),
        },
        {
            name: fakeClassPlugin,
            module: mockdir('plugins/fake-class'),
        },
        {
            name: fakeFnPluginWithConfig,
            module: mockdir('plugins/fake-fn'),
            config: fakeFnPluginConfig
        },
    ];

    it('should return correct plugins', () => {
        const parsedPlugins = parsePlugins(fakePlugins);
        const getPlugin = pluginGetter(parsedPlugins);

        const fnPlugin = getPlugin(fakeFnPlugin);
        const classPlugin = getPlugin(fakeClassPlugin);
        const fnConfigPlugin = getPlugin(fakeFnPluginWithConfig);

        expect(fnPlugin()).toBe(originalFn());
        expect(fnConfigPlugin).toBe(originalFn(fakeFnPluginConfig));
        expect(classPlugin).toHaveProperty('isPluginClass');
        expect(classPlugin._autoinitialize).toHaveBeenCalledTimes(1);
    });

    it('should throw an error during parser', () => {
        const toThrowWrongType = () => parsePlugins([{
            name: fakeWrongPlugin,
            module: mockdir('plugins/fake-wrong')
        }]);

        expect(toThrowWrongType).toThrow(WrongType);
    });
});