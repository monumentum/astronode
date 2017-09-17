const RestooseModel = require('../../../restoose/model');

const structure = {
    name: RestooseModel.string().isRequired()
}

module.exports = RestooseModel.register('Beer', structure);