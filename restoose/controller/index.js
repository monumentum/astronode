const mongoose = require('mongoose');

exports.NewController = (model) => ({
    'controllerName': model.toLowerCase(),
    'model': mongoose.model(model),
    'root': {'get': 'find', 'post': 'create'},
    'rootId': {'get': 'findOne', 'put': 'update', 'delete': 'delete'}
});

exports.find = (model, req) => model.find(req.query);
exports.findOne = (model, req) => model.findOne({ _id: req.params.id });
exports.create = (model, req) => (new model(req.body)).save();
exports.update = (model, req) => model.update({ _id: req.params.id }, req.body);
exports.delete = (model, req) => model.remove({ _id: req.params.id });