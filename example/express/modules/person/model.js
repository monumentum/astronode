const RestooseModel = require('../../../../restoose/model');

const structure = {
    'name': RestooseModel.string().isRequired(),
    'age': RestooseModel.number().hasDefault(0),
};

module.exports = RestooseModel.register('Person', structure);