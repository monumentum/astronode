const mongoose = require('mongoose');

exports.NewController = (model) => ({
    'controllerName': model.toLowerCase(),
    'model': mongoose.model(model),
    'root': {'get': 'find', 'post': 'create'},
    'rootId': {'get': 'findOne', 'put': 'update', 'delete': 'delete'}
});

exports.find = (model, req) => model.find(req.query);
exports.findOne = (model, req) => model.findOne(req.params.id);
exports.create = (model, req) => (new model(req.body)).save();
exports.update = (model, req) => model.findByIdAndUpdate(req.params.id, req.body);
exports.delete = (model, req) => model.findByIdAndDelete(req.params.id);