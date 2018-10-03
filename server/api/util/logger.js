const log4js = require('log4js');

const logger = log4js.getLogger('api');
logger.level = 'DEBUG';

module.exports = logger;
