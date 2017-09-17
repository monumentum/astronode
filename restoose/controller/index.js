const mongoose = require('mongoose');

exports.NewController = (model) => ({
    'controllerName': model.toLowerCase(),
    'model': mongoose.model(model),
    'root': {'get': 'find', 'post': 'create'},
    'rootId': {'get': 'findOne', 'put': 'update', 'delete': 'delete'}
});

exports.find = (model, req) => model.find(req.query);
exports.findOne = (model, req) => model.findOne(req.query);
exports.create = (model, req) => (new model(req.body)).save();
exports.update = (model, req) => model.findByIdAndUpdate(req.param('id'), req.body);
exports.delete = (model, req) => model.findByIdAndDelete(req.param('id'));