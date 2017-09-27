const mongoose = require('mongoose');
const each = require('lodash/each');

function ModelBuilder(type) {
    this.type = type;
}

function injectParams(key, value, message) {
    if (message) {
        this[key] = [value, message];
    } else {
        this[key] = value;
    }

    return this;
}

ModelBuilder.prototype.isRequired = function (message) {
    return injectParams.call(this, 'required', true, message);
};

ModelBuilder.prototype.isUnique = function (message) {
    return injectParams.call(this, 'unique', true, message);
};

ModelBuilder.prototype.hasMax = function (max, message) {
    return injectParams.call(this, 'max', max, message);
};

ModelBuilder.prototype.hasMin = function (min, message) {
    return injectParams.call(this, 'min', min, message);
};

ModelBuilder.prototype.hasDefault = function (d) {
    this.default = d;
    return this;
};

ModelBuilder.prototype.addValidation = function (validation) {
    this.validation = validation;
    return this;
};

ModelBuilder.prototype.hasEnums = function (possibilities) {
    this.enum = possibilities;
    return this;
};

module.exports = {
    string        : () => new ModelBuilder(String),
    date          : () => new ModelBuilder(Date),
    number        : () => new ModelBuilder(Number),
    bool          : () => new ModelBuilder(Boolean),
    register      : (name, structure, methods) => {
        const mountedSchema = new mongoose.Schema(structure);
        each(methods, (value, key) => mountedSchema.static(key, value));
        mongoose.model(name, mountedSchema);
    },
    ref : ref => {
        const model = new ModelBuilder(mongoose.SchemaTypes.ObjectId);
        model.ref = ref;
        return model;
    },
};