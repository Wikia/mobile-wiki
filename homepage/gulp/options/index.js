/*
	Load appropriate options object based on environment
 */

var environment = require('../utils/environment').name;

try {
	module.exports = require('./' + environment);
} catch (exception) {
	console.error('Options for given environment (' + environment + ') not found');
	throw new Error(exception);
}
