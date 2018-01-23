const Promise = require('bluebird');

module.exports = ({ plugins }) => Promise.map(plugins, (plugin) => {
    let holder = Promise.resolve();
    const plugRef = require(plugin.module);
    const pluginInstance = new plugRef(plugin.config);

    if (pluginInstance.autoinitialize) {
        holder = pluginInstance.autoinitialize();
    }

    return holder.then(() => {
        astronode.plugins[plugin.name] = pluginInstance;
    });
}, { concurrency: 20 });