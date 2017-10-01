jest.mock('fs');
jest.mock('../safeRequire');

const Promise = require('bluebird');
const compact = require('lodash/compact');
const namedModulesPackage = require('./');
const expecter = pkg => prop => expect(pkg[prop]);
const spyer = pkg => method => jest.spyOn(pkg, method);

const fs = require.requireMock('fs');
const { safeRequire } = require.requireMock('../safeRequire');

const FAKE = {
    response: 'FAKE_RESPONSE',
    files: ['test1.js', 'test2.js', 'ignoredfolder', 'validfolder'],
    path: 'test',
    file_paths: ['test1', 'test2'],
    readdir: ['ignoredFolder', 'file1.js', 'file2.js'],
    ignoredFolders: ['ignoredFolder'],
    opts: {},
    promise: {}
};

FAKE.promise = {
    response: Promise.resolve(FAKE.response),
    files: Promise.resolve(FAKE.files),
    readdir: Promise.resolve(FAKE.readdir),
};

describe('(restoose/utils) Named Modules', () => {
    let spyOn;
    
    beforeEach(() => {
        spyOn = spyer(namedModulesPackage);
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
        safeRequire.mockClear();
    });
    
    it('should exec namedModules', () => {
        spyOn('recursivePathMapper').mockReturnValue(FAKE.promise.response);
        spyOn('loadModels').mockReturnValue(FAKE.promise.response);
        spyOn('loadControllers').mockReturnValue(FAKE.promise.response);
        
        return namedModulesPackage.namedModules(FAKE.path, FAKE.opts).then(result => {
            const _expect = expecter(namedModulesPackage);
            
            _expect('recursivePathMapper').toHaveBeenCalledWith(`${process.cwd()}/test`, FAKE.opts);
            _expect('loadModels').toHaveBeenCalledWith(FAKE.opts, FAKE.response);
            _expect('loadControllers').toHaveBeenCalledWith(FAKE.response);
        });
    });
    
    it('should exec loadControllers', () => {
        safeRequire.mockReturnValue(FAKE.promise.response);
        
        return namedModulesPackage.loadControllers(FAKE.file_paths).then(() => {
            expect(safeRequire).toHaveBeenCalledTimes(FAKE.file_paths.length);
        });
    });
    
    it('should exec loadModels', () => {
        safeRequire.mockReturnValue(FAKE.promise.response);
        
        const opts = { modelPattern: 'test' };
        const paths = ['testInPattern', 'noMatch', 'nonMatchToo'];
        
        return namedModulesPackage.loadModels(opts, paths).then(() => {
            expect(safeRequire).toHaveBeenCalledTimes(1);
        });
    });
    
    it('should exec recursivePathMapper', () => {
        spyOn('promiseReaddir').mockReturnValue(FAKE.promise.readdir);
        const opts = { ignoredFolders: FAKE.ignoredFolders };
        
        return namedModulesPackage.recursivePathMapper('', opts).then(files => {
            expect(files).toHaveLength(FAKE.readdir.length);
            expect(compact(files)).toHaveLength(2);
        });
    });
    
    it('should exec promiseReaddir', () => {
        fs.readdir.mockImplementation((path, cb) => cb(null, [path]));

        return namedModulesPackage.promiseReaddir(FAKE.path).then(files => {
            expect(files[0]).toBe(FAKE.path);
        });
    });
});