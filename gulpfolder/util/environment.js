var argv = require('minimist')(process.argv.slice(2)),
	environment = argv.env || 'dev';

module.exports = environment;
