/*
 * Options for dev environment
 */

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
		server: {
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
			name: 'Homepage front',
			out: 'docs/front',
			module: 'commonjs',
			target: 'es5'
		},
		server: {
			name: 'Homepage server',
			out: 'docs/server',
			module: 'commonjs',
			target: 'es5'
		}
	}
};
