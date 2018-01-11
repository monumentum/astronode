const { omit } = require('lodash');

exports.constructUri = opts => ({
    uri: `mongodb://${opts.uri}:${opts.port}/${opts.database}`,
    options: omit(opts, 'uri', 'port', 'database'),
});

exports.Services = modelName => {
    const Model = astronaut.models[modelName.toLowerCase()];

    return {
        find: req => Model.find().exec().then(r=>{console.log(r); return r}),
        create: req => (new Model(req.body)).save(),
        findById: req => Model.findById(req.params.id),
        delete: req => Model.findByIdAndRemove(req.params.id),
        update: req => Model.findByIdAndUpdate(req.params.id, { $set: req.body }),
    }
}

exports.start = (opts) => {
    console.log("START");
    const {uri, options} = exports.constructUri(opts);
    const mongoose = require('mongoose');

    mongoose.Promise = require('bluebird');

    const mongoConnection = mongoose.createConnection(uri, options);

    mongoConnection.on('connected', function () {
        console.log('Mongoose default connection open to ' + uri);
    });

    mongoConnection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    mongoConnection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    mongoConnection.on('open', function () {
        console.log('Mongoose default connection is open');
    });

    process.on('SIGINT', function() {
        mongoConnection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    return mongoConnection;
}