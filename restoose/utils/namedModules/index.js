const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const CONCURRENCY = { concurrency: 20 };

const isFile = item => ~item.indexOf('.');
const isIgnored = (item, patterns) => _.some(patterns, matchPattern.bind(null, item));
const matchPattern = (item, pattern) => {
    return !!item.match(new RegExp(pattern));
};

exports.safeRequire = (path, message, ErrInstance) => {
    try {
        require.resolve(path);
        return require(path);
    } catch (e) {
        if (ErrInstance) throw new ErrInstance(message || e);
        throw new Error(message || e);
    }
};

exports.promiseReaddir = path => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, items) => {
            console.log(err, items);
            if (err) return reject(err);
            return resolve(items);
        });
    });
};

exports.recursivePathMapper = (path, opts) => {
    return exports.promiseReaddir(path).map(item => {
        if (isIgnored(item, opts.ignoreFolders)) return Promise.resolve(null);
        if (!isFile(item)) return exports.recursivePathMapper(`${path}/${item}`, opts);
        
        return Promise.resolve(`${path}/${item}`);
    }, CONCURRENCY);
};

exports.loadModels = (opts, allPaths) => {
    let controllers = [];
    let flattedPaths = _.flatten(allPaths);
    
    _.forEach(flattedPaths, path => {
        if (matchPattern(path, opts.modelPattern)) {
            return exports.safeRequire(path);
        }
        controllers.push(path);
    });
    
    return Promise.resolve(_.xor(controllers, null));
};

exports.loadControllers = controllerPaths => {
    const controllerMapper = path => Promise.resolve(exports.safeRequire(path));
    return Promise.map(controllerPaths, controllerMapper, CONCURRENCY);
};

exports.namedModules = (path, opts) => {
    return exports.recursivePathMapper(`${process.cwd()}/${path}`, opts)
        .then(exports.loadModels.bind(null, opts))
        .then(exports.loadControllers);
};