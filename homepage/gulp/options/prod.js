/*
 * Options for prod environment
 */

var paths = require('../paths');

module.exports = {
	sass: {
		outputStyle: 'compressed',
		errLogToConsole: false
	},
	scripts: {
		front: {
			target: 'es5',
			noImplicitAny: true,
			removeComments: true,
			declarationFiles: false,
			sortOutput: true
		},
		server: {
			module: 'commonjs',
			target: 'es5',
			emitError: false,
			outDir: paths.scripts.server.dest,
			removeComments: true,
			noImplicitAny: true,
			declarationFiles: false
		}
	},
	doc: {
		front: {},
		server: {}
	},
	tslint: {
		emitError: true
	}
};
