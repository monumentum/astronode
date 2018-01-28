const { isArray, isObject, isString, map, mapValues, get } = require('lodash');

const normalize = value => {
    if (isArray(value)) return normalizeArray(value);
    if (isObject(value)) return normalizeObject(value);
    if (isString(value) && value[0] === '$') return get(process, `env.${value.replace('$', '')}`);

    return value;
};

const normalizeArray = values => map(values, normalize);
const normalizeObject = values => mapValues(values, normalize);

module.exports = (configs) => normalizeObject(configs)