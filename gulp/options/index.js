/*
	Load appropriate options object based on environment
 */

var environment = require('../utils/environment').name;

try {
	module.exports = require('./' + environment);
} catch (exception) {
	console.log('Options for given environment (' + environment + ') not found');
	console.log(exception.message);
	process.exit(1)
}

