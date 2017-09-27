jest.mock('mongoose', () =>{
    let original = require.requireActual('mongoose');

    return Object.assign(original, {
        Schema: jest.fn(),
        model: jest.fn()
    });
});

const model = require('./');
const mongoose = require.requireMock('mongoose');

const FAKE_REF = 'test';

const METHODS = [
    'isRequired', 'isUnique', 'hasMax',
    'hasMin', 'hasDefault', 'addValidation',
    'hasEnums',
];

const TYPES = {
    'string': { entity: String },
    'number': { entity: Number },
    'date': { entity: Date },
    'bool': { entity: Boolean },
    'ref': { entity: mongoose.SchemaTypes.ObjectId, arg: FAKE_REF, expect: { ref: FAKE_REF } }
};

function assertMongooseObject(entry, type, expectedObj) {
    METHODS.forEach(method => expect(entry[method]).toBe(model[type]()[method]));
    expect(entry).toEqual(expectedObj);
}

function constructItForMethods(type, entity, addExpect, arg) {
    let modelPropertyObj;
    addExpect = addExpect || {};
    
    beforeEach(() => {
        modelPropertyObj = model[type](arg);
    });

    it('should create a ' + type + ' with required flag', () => {
        assertMongooseObject(modelPropertyObj.isRequired(), type , Object.assign(
            {type: entity, required: true},
            addExpect
        ));
    });

    it('should create a ' + type + ' with required flag with message', () => {
        const message = 'test error message';
        assertMongooseObject(modelPropertyObj.isRequired(message), type, Object.assign(
            { type: entity, required: [true, message] },
            addExpect
        ));
    });

    it('should create a ' + type + ' with unique flag', () => {
        assertMongooseObject(modelPropertyObj.isUnique(), type, Object.assign(
            { type: entity, unique: true },
            addExpect
        ));
    });

    it('should create a ' + type + ' with max lenght', () => {
        const max = 10;
        assertMongooseObject(modelPropertyObj.hasMax(max), type, Object.assign({ type: entity, max: max },  addExpect));
    });

    it('should create a ' + type + ' with min lenght', () => {
        const min = 10;
        assertMongooseObject(modelPropertyObj.hasMin(min), type, Object.assign({ type: entity, min: min}, addExpect));
    });

    it('should create a ' + type + ' with default string', () => {
        const _default = 'the default string';
        assertMongooseObject(modelPropertyObj.hasDefault(_default), type, Object.assign({ type: entity, default: _default }, addExpect));
    });

    it('should create a ' + type + ' with validation string', () => {
        const validation = 'validation stuff';
        assertMongooseObject(modelPropertyObj.addValidation(validation), type, Object.assign({ type: entity, validation: validation }, addExpect));
    });

    it('should create a ' + type + ' with enums', () => {
        const enums = 'enums stuff';
        assertMongooseObject(modelPropertyObj.hasEnums(enums), type, Object.assign({ type: entity, enum: enums }, addExpect));
    });
}

describe('(restoose/model) Index', () => {
    Object.keys(TYPES).forEach(key => {
        let value = TYPES[key];
        constructItForMethods(key, value.entity, value.expect, value.arg);
    });

    it('should register a module using mongoose', () => {
        const name = 'Test';
        const structure = 'fakeStructure';

        model.register(name, structure);

        expect(mongoose.Schema).toHaveBeenCalledWith(structure);
        expect(mongoose.model).toHaveBeenCalledWith(name, {});
    });
});