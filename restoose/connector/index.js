const mongoose = require( 'mongoose' );
const { verbose, error, info } = require('../logger');

exports.Connector = (uri, opts) => {
    mongoose.connect(uri, opts);
    
    mongoose.connection.on('connected', function () {
        verbose('Mongoose default connection open to ' + uri);
    });
    
    mongoose.connection.on('error', function (err) {
        error('Mongoose default connection error: ' + err);
    });
    
    mongoose.connection.on('disconnected', function () {
        verbose('Mongoose default connection disconnected');
    });
    
    mongoose.connection.on('open', function () {
        verbose('Mongoose default connection is open');
    });
    
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
    
    return mongoose.connection;
};