const { omitBy, isEmpty, isArray } = require('lodash');

const CLEAR_REGEX = /^!/;

const clearName = name => name.replace(CLEAR_REGEX, '');
const isPlugin = name => name[0] === '!';
const getName = name => clearName(name.split(':')[0]);
const removeEmptyChain = config => isArray(config) && isEmpty(config);

const getChain = name => {
    const chain = name.split(':');

    chain.shift();
    return chain.map(c => c.split(','));
};

module.exports = name => omitBy({
    isPlugin: isPlugin(name),
    name: getName(name),
    chain: getChain(name)
}, removeEmptyChain);