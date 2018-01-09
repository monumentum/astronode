const fs = require('fs');
const Promise = require('bluebird');

const callback = (resolve, reject) => (err, items) => {
    if (err) return reject(err);
    return resolve(items);
}

const isFile = file => {}
const isIgnored = file => {}

exports.readdir = path => new Promise((resolve, reject) => {
    fs.readdir(path, callback(resolve, reject));
});

exports.recursiveDir = path =>
    exports.readdir(path).map(file => {
        if (isIgnored(file)) return Promise.resolve(null);
        if (isFile(file)) return Promise.resolve(`${path}/${file}`);

        return exports.recursiveDir(`${path}/${file}`);
    });

exports.requireDeepDir = path =>
    exports.recursiveDir(path).map(require);