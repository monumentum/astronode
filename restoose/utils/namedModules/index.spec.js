jest.mock('fs', () => ({
    readdir: (path, cb) => cb(null, [path])
}));

const clone = require('lodash/clone');
const each = require('lodash/each');
const namedModulesOriginalPackage = require('./');

const mockPackage = (pkg, methods) => {
    let newPackage = clone(pkg);
    each(methods, method => newPackage[method] = jest.fn());
    return newPackage;
};

const FAKE_PATH = 'test';
const FAKE_OPTS = {};

describe('(restoose/utils) Named Modules', () => {
    it('should exec namedModules', () => {
        const FAKE_RETURN = 'FAKE_RETURN';
        const FAKE_PROMISE = Promise.resolve(FAKE_RETURN);

        const pkg = mockPackage(namedModulesOriginalPackage, [
            'recursivePathMapper', 'loadModels', 'loadControllers'
        ]);
        
        pkg.recursivePathMapper.mockReturnValue(FAKE_PROMISE);
        pkg.loadModels.mockReturnValue(FAKE_PROMISE);
        
        return pkg.namedModules(FAKE_PATH, FAKE_OPTS).then(() => {
            expect(pkg.loadModels).toHaveBeenCalledWith(FAKE_OPTS, FAKE_RETURN);
            expect(pkg.loadControllers).toHaveBeenCalledWith(FAKE_RETURN);
            expect(pkg.recursivePathMapper).toHaveBeenCalledWith(
                `${process.cwd()}/${FAKE_PATH}`, FAKE_OPTS
            ); 
        });
    });
});