const { zipObject, map } = require('lodash');
const { WrongType } = require('astronode-utils/lib/error');

const getPluginInstance = plugin => {
    let pluginInstance = null;
    const plugRef = require(plugin.module);

    try {
        pluginInstance = new plugRef(plugin.config);
    } catch (e) {
        if (typeof plugRef !== 'function' && !!e.message.match(/not a constructor/)) {
            throw new WrongType(typeof plugRef, ['function', 'class'], plugin.name);
        }

        pluginInstance = plugin.config ? plugRef(plugin.config) : plugRef;
    }

    return pluginInstance;
};

module.exports = (plugins) =>
    zipObject(map(plugins, 'name'), map(plugins, getPluginInstance));
