/*
 * Path list for tasks
 */
var path = require('path'),
	output = 'dist',
	serverOutput = output + '/server',
	frontOutput = output + '/front',
	mainApp = 'front/main';

module.exports = {
	base: output,
	baseFull: path.resolve(output),
	baseFullServer: path.resolve(serverOutput),
	baseFullFront: path.resolve(frontOutput),
	vendor: {
		src: 'front/vendor/**/*',
		dest: output + '/front/vendor',
		original: 'front/vendor'
	},
	locales: {
		src: 'front/public/locales/**/*.json',
		dest: output + '/front/locales'
	},
	styles: {
		src: 'front/styles',
		watch: 'front/styles/**/*.scss',
		dest: output + '/front/styles',
		partials: '_*.scss',
		compile: '*.scss'
	},
	common: {
		public: {
			src: 'front/common/public/**/*',
			dest: frontOutput + '/common'
		},
		scripts: {
			base: 'front/common',
			dest: {
				main: mainApp + '/vendor',
			}
		}
	},
	scripts: {
		front: {
			src: 'front/scripts',
			dest: output + '/front/scripts',
			jsFiles: '**/*.js'
		}
	},
	symbols: {
		src: 'front/svg/symbols',
		dest: output + '/front/svg',
		files: '*.svg'
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
			src: 'server/app/**/*.js',
			config: 'server/config/*.js',
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
	}
};
