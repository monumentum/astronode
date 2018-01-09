const { isArray, isObject, isString, map, mapValues } = require('lodash');

const normalize = value => {
    if (isObject(value)) return normalizeObject(value);
    if (isArray(value)) return normalizeArray(value);
    if (isString(value) && value[0] === '$') return process.env[value.replace('$', '')];

    return value;
};

const normalizeArray = values => map(values, normalize)
const normalizeObject = values => mapValues(values, normalize);

module.exports = values => normalizeObject(values);