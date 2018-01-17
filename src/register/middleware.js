const { fs, getFileName } = require('../util');

module.exports = config =>
    fs.recursiveDir(`${astronode.ROOT_PATH}/${config.middlewares}`)
        .each(path => {
            astronode.middlewares[getFileName(path)] = require(path);
        });