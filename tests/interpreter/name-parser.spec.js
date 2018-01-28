const nameParser = require('../../src/interpreter/name-parser');

describe('Name Parser', () => {
    const name = 'myFunc';
    const param = ['test', 'unit'];
    const stringParam = param.join(',');

    const baseTest = (name, entry, cb) => {
        const result = nameParser(entry);
        expect(result).toHaveProperty('name', name);
        cb(result);
    };

    it('should parse a simple function name', () => {
        baseTest(name, name, result => {
            expect(result).toHaveProperty('isPlugin', false);
            expect(result).not.toHaveProperty('chain');
        });
    });

    it('should parse a one level closure function', () => {
        baseTest(name, `${name}:${stringParam}`, result => {
            expect(result).toHaveProperty('chain', [param]);
            expect(result).toHaveProperty('isPlugin', false);
        });
    });

    it('should parse a two level closure function', () => {
        baseTest(name, `${name}:${stringParam}:${stringParam}`, result => {
            expect(result).toHaveProperty('chain', [param, param]);
            expect(result).toHaveProperty('isPlugin', false);
        });
    });

    it('should parse a plugin with params', () => {
        baseTest(name, `!${name}:${stringParam}`, result => {
            expect(result).toHaveProperty('chain', [param]);
            expect(result).toHaveProperty('isPlugin', true);
        });
    });
});