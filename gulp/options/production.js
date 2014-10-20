/*
 * Options for production environment
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
	nodemon: {
		script: 'www/server/app.js',
		ext: 'js',
		watch: [
			'www/server'
		]
	},
	tslint: {
		emitError: true
	},
	gzip: {
		gzipOptions: {
			level: zlib.Z_BEST_COMPRESSION
		}
	}
};
