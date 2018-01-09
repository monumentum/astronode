const databaseConnections = require('./database');

module.exports = function (driverName, opts) {
    return databaseConnections[driverName](opts);
}