/*
 * Options for dev environment
 */

var paths = require('../paths');

module.exports = {
	sass: {
		outputStyle: 'nested',
		sourceComments: 'map',
		errLogToConsole: true
	},
	server: {
		path: paths.server.script,
		env: process.env,
		killSignal: 'SIGKILL',
		delay: 0,
		successMessage: /Server started/
	},
	replace: {
		selector: false,
		find: '',
		replace: ''
	}
};
