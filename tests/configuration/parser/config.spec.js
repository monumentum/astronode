const parseConfig = require('../../../src/configuration/parser/config');

describe('Configuration > Parse Config File', () => {
    it('should parse configuration with process.env', () => {
        process.env.var1 = 'test1';
        process.env.var2 = 'test2';
        process.env.var3 = 'test3';
        process.env.var4 = 'test4';

        const parsedConfig = parseConfig(`${process.cwd()}/tests/__mocks__/config.mock.json`);

        expect(parsedConfig.object).toHaveProperty('string', process.env.var1);
        expect(parsedConfig.object).toHaveProperty('array', [process.env.var2]);
        expect(parsedConfig.array).toHaveProperty('0', process.env.var3);
        expect(parsedConfig.array).toHaveProperty('1', { 'obj': process.env.var4 });
    });
});