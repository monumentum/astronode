const mongoose = require('mongoose');

class Controller {
    constructor(model, extend) {
        this.model = mongoose.model(model);
        this.root = {
            get: this.find,
            post: this.create,
        }

        this.rootId = {
            get: this.findById,
            put: this.update,
            delete: this.delete,
        }

        _.forEach(extend, (value, key) => _.set(this, key, value));
    }

    find(req, res, next) {
        return this.modelCall(this.model.find({}), res)
    }

    findById(req, res, next) {
        return this.modelCall(this.model.findById(req.param('id')), res)
    }

    create(req, res, next) {
        const instance = new this.model(req.body);
        return this.modelCall(instance.save(), res);
    }

    update(req, res, next) {
        return this.modelCall(this.model.find(req.param('id'), req.body), res);
    }

    delete(req, res, next) {
        return this.modelCall(this.model.delete(req.param('id')), res);
    }

    modelCall(promise, res) {
        promise.then((results) => {
            res.json(200, { results: results })
        }).catch((error) => {
            res.json(500, { error: error })
        });
    }
}

module.exports = Controller;