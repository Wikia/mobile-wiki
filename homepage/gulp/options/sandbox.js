/*
 * Options for prod environment
 */

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
