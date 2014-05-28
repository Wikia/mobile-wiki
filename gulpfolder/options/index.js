/*
	Load appropriate options object based on environment
 */

var environment = require('../util/environment');

module.exports = require('./' + environment);
