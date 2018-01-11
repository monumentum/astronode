const { fs, getModuleName } = require('../util');

const hasPattern = (pattern, path) =>
    !!path.match(new RegExp(pattern, "g"));

const isController = (config, path) =>
    hasPattern(config.modelPattern, path)

const isModel = (config, path) =>
    hasPattern(config.modelPattern, path)

module.exports = config =>
    fs.recursiveDir(`${astronaut.ROOT_PATH}/${config.modules.root}`, { ignored: config.modules.ignored })
        .each(path => {
            const _module = getModuleName(path, config.modules.root);

            if (!_module) {
                return;
            }

            if (isController(config.modules.controllerPattern, path)) {
                astronaut.controllers[_module] = require(path);
            }

            if (isModel(config.modules.modelPattern, path)) {
                astronaut.models[_module] = require(path);
            }
        });