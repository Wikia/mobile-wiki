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
			target: 'es5',
			noImplicitAny: true,
			removeComments: false,
			declarationFiles: false,
			sortOutput: true
		},
		back: {
			module: 'commonjs',
			target: 'es5',
			emitError: false,
			noImplicitAny: true,
			declarationFiles: false,
			removeComments: false
		}
	},
	clean: {
		read: false
	},
	server: {
		path: paths.server.script,
		env: {
			WORKER_COUNT: 2,
			MAX_REQUEST_PER_CHILD: 1000
		},
		killSignal: 'SIGKILL',
		delay: 0,
		successMessage: /Server started/
	},
	tslint: {
		emitError: false
	}
};
