/*
 * Options for production environment
 */

var paths = require('../paths');

module.exports = {
	sass: {
		outputStyle: 'compressed',
		errLogToConsole: false
	},
	scripts: {
		front: {
			target: 'ES5',
			sourcemap: false,
			outDir: paths.scripts.front.out,
			out: 'main.js',
			//mapRoot: '',
			emitError: false,
			removeComments: true
		},
		back: {
			module: 'commonjs',
			target: 'ES5',
			emitError: false,
			outDir: paths.scripts.back.out,
			removeComments: true
		}
	},
	handlebars: {
		output: 'browser'
	},
	svg: {
		defs: true
	},
	clean: {
		read: false
	},
	nodemon: {
		script: 'www/server/app.js',
		ext: 'js',
		watch: [
			'www/server'
		]
	}
};
