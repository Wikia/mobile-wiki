/*
	Load appropriate options object based on environment
 */

var environment = require('../util/environment').name;

try {
	module.exports = require('./' + environment);
} catch (ex) {
	console.log('Options for given environment (' + environment + ') not found');
	process.exit(1)
}

