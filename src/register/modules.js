const { fs, getModuleName } = require('../util');

const hasPattern = (pattern, path) => !!path.match(new RegExp(pattern, 'g'));

module.exports = config =>
    fs.recursiveDir(`${astronode.MODULES_PATH}`, { ignored: config.application.ignoredPaths })
        .each(path => {
            const _module = getModuleName(path, config.application.modules);

            if (!_module) {
                return;
            }

            if (hasPattern(config.application.controllerPattern, path)) {
                astronode.controllers[_module] = require(path);
            }

            if (hasPattern(config.application.modelPattern, path)) {
                astronode.models[_module] = require(path);
            }
        });