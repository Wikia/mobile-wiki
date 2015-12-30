/*
 * Path list for tasks
 */
var path = require('path'),
	output = 'dist',
	serverOutput = output + '/server',
	frontOutput = output + '/front',
	mainSource = 'front/main',
	jsPattern = '**/*.js';

module.exports = {
	base: output,
	baseFull: path.resolve(output),
	baseFullServer: path.resolve(serverOutput),
	baseFullFront: path.resolve(frontOutput),
	jsPattern: jsPattern,

	auth: {
		scripts: {
			base: './front/auth',
			src: 'front/auth/app/' + jsPattern,
			dest: frontOutput + '/auth'
		}
	},
	common: {
		dest: frontOutput + '/common',
		destMain: mainSource + '/vendor',
		public: {
			src: 'front/common/public/**/*',
		},
		scripts: {
			src: 'front/common',
		}
	},
	images: {
		src: ['front/svg/images/*', 'front/images/*'],
		dest: output + '/front/images'
	},
	server: {
		config: {
			src: 'server/config/',
			baseFile: 'localSettings.base.js',
			exampleFile: 'localSettings.example.js',
			runtimeFile: 'localSettings.js'
		},
		nodeModules: {
			src: 'node_modules',
			dest: serverOutput + '/node_modules'
		},
		script: output + '/server/server.js',
		scripts: {
			src: 'server/app/' + jsPattern,
			config: 'server/config/' + jsPattern,
			dest: output
		},
		views: {
			src: 'server/app/views/**/*.hbs',
			dest: serverOutput + '/app/views',
			mainIndex: {
				src: frontOutput + '/main/index.html',
				dest: serverOutput + '/app/views/_layouts',
				outputFilename: 'ember-main.hbs'
			}
		},
	},
	styles: {
		src: 'front/styles',
		watch: 'front/styles/**/*.scss',
		dest: output + '/front/styles',
		partials: '_*.scss',
		compile: '*.scss'
	},
	symbols: {
		src: 'front/svg/symbols',
		dest: output + '/front/svg',
		files: '*.svg'
	},
	vendor: {
		src: 'front/vendor/**/*',
		dest: output + '/front/vendor',
		original: 'front/vendor'
	},
};
