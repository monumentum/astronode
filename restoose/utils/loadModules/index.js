const fs = require('fs');
const Promise = require('bluebird');

function readDeep (basePath, opts) {
    readdir(basePath).then(items => {
        return Promise.map(filterItems(items, opts), deepMap, { concurrency: 10 });
    });

    function deepMap(item) {
        switch(kindOfItem(item, opts)) {
            case CONTROLLER:
                return Promise.resolve(require(item));
            case FOLDER:
                return readDeep(`${basePath}/${item}`);
        }
    }
}

function readdir(basePath) {
    return new Promise((resolve, reject) => {
        fs.readdir(basePath, (err, items) => {
            if (err) return reject(err);
            return resolve(items);
        })
    });
}

module.exports = readDeep;