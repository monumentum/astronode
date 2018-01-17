const { omit, each } = require('lodash');
const Promise = require('bluebird');

class MongooseService {
    constructor(model) {
        this.model = model;

        this.find = this.find.bind(this);
        this.findById = this.findById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    find() {
        return this.model.find().exec();
    }

    findById(req) {
        return this.model
            .findOne({ _id: req.params.id})
            .exec();
    }

    create(req) {
        const item = new this.model(req.body);
        return item.save();
    }

    update(req) {
        return this.model.findByIdAndUpdate(req.params.id, {$set:req.body});
    }

    delete(req) {
        return this.model.findByIdAndRemove(req.params.id);
    }
}

class MongooseAdapter {
    constructor(opts) {
        this.uri = `mongodb://${opts.uri}:${opts.port}/${opts.database}`;
        this.opts = omit(opts, 'uri', 'port', 'database');

        this.mongoose = require('mongoose');
        this.services = this.services.bind(this);
    }

    services(modelName) {
        const model = this.conn.model(modelName);
        return new MongooseService(model);
    }

    start() {
        this.mongoose.Promise = require('bluebird');
        this.conn = this.mongoose.createConnection(this.uri, this.opts);

        this.conn.on('error', err => {
            console.log('Mongoose default connection error: ' + err);
        });

        this.conn.on('disconnected', () => {
            console.log('Mongoose default connection disconnected');
        });

        process.on('SIGINT', () => {
            this.conn.close(() => {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        return new Promise(resolve => {
            this.conn.on('connected', () => {
                console.log('Mongoose default connection open to ' + this.uri);
                this._registerModels();
                resolve();
            });
        });
    }

    _registerModels() {
        each(astronode.models, (schema, name) => {
            astronode.models[name] = this.conn.model(
                name, new this.mongoose.Schema(schema)
            );
        });
    }
}

module.exports = MongooseAdapter;