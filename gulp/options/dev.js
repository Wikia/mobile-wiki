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
	handlebars: {
		output: 'browser'
	},
	clean: {
		read: false
	},
	nodemon: {
		script: paths.nodemon.script,
		ext: 'js',
		watch: paths.nodemon.watch,
		env: {
			WORKER_COUNT: 4,
			MAX_REQUEST_PER_CHILD: 1000
		}
	},
	tslint: {
		emitError: false
	}
};
