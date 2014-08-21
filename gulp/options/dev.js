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
			sourcemap: false,
			noImplicitAny: true,
			//mapRoot: '',
			emitError: false,
			removeComments: false
		},
		back: {
			module: 'commonjs',
			target: 'ES5',
			emitError: false,
			noImplicitAny: true,
			outDir: paths.scripts.back.dest,
			removeComments: true
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
			WORKER_COUNT: 2,
			MAX_REQUEST_PER_CHILD: 1000
		}
	},
	tslint: {
		emitError: false
	}
};
