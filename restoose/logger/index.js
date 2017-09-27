const winston = require('winston');

winston.level = process.env.RESTOOSE_LOG_LEVEL || 'info';

module.exports = winston;