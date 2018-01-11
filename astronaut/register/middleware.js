const { fs, getFileName } = require('../util');

module.exports = config =>
    fs.recursiveDir(`${astronaut.ROOT_PATH}/${config.middlewares}`)
        .each(path => {
            astronaut.middlewares[getFileName(path)] = require(path);
        });