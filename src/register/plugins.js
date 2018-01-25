const Promise = require('bluebird');
const { WrongType } = require('astronode-utils/lib/error');

module.exports = ({ plugins }) => Promise.each(plugins, (plugin) => {
    let holder = Promise.resolve();
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

    if (pluginInstance.autoinitialize) {
        holder = pluginInstance.autoinitialize();
    }

    return holder.then(() => {
        astronode.plugins[plugin.name] = pluginInstance;
    });
});