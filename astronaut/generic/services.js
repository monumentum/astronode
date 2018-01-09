const byId = ({ params }) => ({
    _id: params.id,
});

const mod = body => ({
    '$set': body,
});

exports.find = model => req => model.find({}).exec();
exports.findById = model => req => model.find(byId(req)).exec();
exports.create = model => req => (new model(req.body)).save();
exports.update = model => req => model.update(byId(req), mod(req.body));
exports.delete = model => req => model.remove(byId(req));