const { fs, getModuleName } = require('../util');

const hasPattern = (pattern, path) => !!path.match(new RegExp(pattern, 'g'));

module.exports = config =>
    fs.recursiveDir(`${astronaut.ROOT_PATH}/${config.modules.root}`, { ignored: config.modules.ignored })
        .each(path => {
            const _module = getModuleName(path, config.modules.root);

            if (!_module) {
                return;
            }

            if (hasPattern(config.modules.controllerPattern, path)) {
                astronaut.controllers[_module] = require(path);
            }

            if (hasPattern(config.modules.modelPattern, path)) {
                astronaut.models[_module] = require(path);
            }
        });