const fs = require('fs');
const Promise = require('bluebird');

const { compact, flattenDeep } = require('lodash');

const callback = (resolve, reject) => (err, items) => {
    if (err) return reject(err);
    return resolve(items);
}

const hasPattern = (pattern, path) =>
    !!path.match(new RegExp(pattern, "g"));

const isIgnored = (file, ignored) => {
    return ~ignored.indexOf(file)
}
const isFile = file => hasPattern(".js$", file);

exports.readdir = path => new Promise((resolve, reject) => {
    fs.readdir(path, callback(resolve, reject));
});

exports.recursiveDir = (path, opts = {}) =>
    exports.readdir(path).map(file => {
        if (opts.ignored && isIgnored(file, opts.ignored)) return Promise.resolve(null);
        if (isFile(file)) return Promise.resolve(`${path}/${file}`);

        return exports.recursiveDir(`${path}/${file}`, opts);
    }).then(compact).then(flattenDeep)