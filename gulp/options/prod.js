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
			sortOutput: true
		},
		back: {
			module: 'commonjs',
			target: 'es5',
			emitError: false,
			outDir: paths.scripts.back.dest,
			removeComments: true,
			noImplicitAny: true,
			declarationFiles: false
		}
	},
	doc: {
		front: {},
		back: {}
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
		selector: '**/layout.hbs',
		find: '/front/',
		replace: '{{server.cdnBaseUrl}}/front/'
	}
};
