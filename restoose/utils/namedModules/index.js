const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const CONCURRENCY = { concurrency: 20 };

const isFile = item => ~item.indexOf('.');
const isIgnored = (item, patterns) => _.some(patterns, matchPattern.bind(null, item));
const matchPattern = (item, pattern) => {
    return !!item.match(new RegExp(pattern));
};

function safeRequire(path, message, ErrInstance) {
    try {
        require.resolve(path);
        return require(path);
    } catch (e) {
        if (ErrInstance) throw new ErrInstance(message || e);
        throw new Error(message || e);
    }
}

function recursivePathMapper(path, opts) {
    return fs.readdirAsync(path).map(item => {
        if (isIgnored(item, opts.ignoreFolders)) return Promise.resolve(null);
        if (!isFile(item)) return recursivePathMapper(`${path}/${item}`, opts);
        
        return Promise.resolve(`${path}/${item}`);
    }, CONCURRENCY);
}

function loadModels(opts, allPaths) {
    let controllers = [];
    let flattedPaths = _.flatten(allPaths);
    
    _.forEach(flattedPaths, path => {
        if (matchPattern(path, opts.modelPattern)) {
            return safeRequire(path)
        };
        controllers.push(path);
    });
    
    return Promise.resolve(_.xor(controllers, null));
}

function loadControllers(controllerPaths) {
    const controllerMapper = path => Promise.resolve(safeRequire(path));
    return Promise.map(controllerPaths, controllerMapper, CONCURRENCY);
}

module.exports = (path, opts) => {
    return recursivePathMapper(`${process.cwd()}/${path}`, opts)
                  .then(loadModels.bind(null, opts))
                  .then(loadControllers);
}