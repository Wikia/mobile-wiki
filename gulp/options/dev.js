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
			sourcemap: true,
			outDir: paths.scripts.front.out,
			out: 'main.js',
			//mapRoot: '',
			emitError: false,
			removeComments: false
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
		script: paths.nodemon.script,
		ext: 'js',
		watch: paths.nodemon.watch
	},
	tslint: {
		emitError: false
	}
};
