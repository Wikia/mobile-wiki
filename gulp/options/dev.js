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
	scripts: {
		front: {
			target: 'ES5',
			noImplicitAny: true,
			removeComments: false,
			declarationFiles: false,
			sortOutput: true
		},
		back: {
			module: 'commonjs',
			target: 'ES5',
			emitError: false,
			noImplicitAny: true,
			declarationFiles: false,
			removeComments: false
		}
	},
	doc: {
		front: {
			name: 'Mercury front',
			out: 'docs/front',
			module: 'commonjs',
			target: 'es5'
		},
		back: {
			name: 'Mercury back',
			out: 'docs/back',
			module: 'commonjs',
			target: 'es5'
		}
	},
	server: {
		path: paths.server.script,
		env: process.env,
		killSignal: 'SIGKILL',
		delay: 0,
		successMessage: /Server started/
	},
	tslint: {
		emitError: false
	},
	replace: {
		selector: false,
		find: '',
		replace: ''
	}
};
