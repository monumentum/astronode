const { fs, getFileName } = require('../util');

module.exports = config =>
    fs.recursiveDir(`${astronode.ROOT_PATH}/${config.application.middlewares}`)
        .each(path => {
            astronode.middlewares[getFileName(path)] = require(path);
        });