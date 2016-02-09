/*
 * Options for prod environment
 */

var paths = require('../paths');

module.exports = {
	sass: {
		outputStyle: 'compressed',
		errLogToConsole: false
	},
	server: {
		path: paths.server.script,
		env: process.env,
		killSignal: 'SIGKILL',
		delay: 0,
		successMessage: /Server started/
	},
	replace: {
		selector: {
			layouts: '**/_layouts/ember-main.hbs',
			partials: '**/_partials/*.hbs'
		},
		find: '/front/',
		replace: '{{server.cdnBaseUrl}}/mercury-static/'
	}
};
