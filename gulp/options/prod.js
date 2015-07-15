/*
 * Options for prod environment
 */

var zlib = require('zlib' ),
	paths = require('../paths');

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
			sortOutput: true,
			suppressImplicitAnyIndexErrors: true
		},
		server: {
			module: 'commonjs',
			target: 'es5',
			emitError: false,
			outDir: paths.scripts.server.dest,
			removeComments: true,
			noImplicitAny: true,
			declarationFiles: false,
			suppressImplicitAnyIndexErrors: true
		}
	},
	doc: {
		front: {},
		server: {}
	},
	server: {
		path: paths.server.script,
		env: process.env,
		killSignal: 'SIGKILL',
		delay: 0,
		successMessage: /Server started/
	},
	tslint: {
		emitError: true
	},
	gzip: {
		gzipOptions: {
			level: zlib.Z_BEST_COMPRESSION
		}
	},
	replace: {
		selector: '**/ember-main.hbs',
		find: '/front/',
		replace: '{{server.cdnBaseUrl}}/mercury-static/'
	}
};
