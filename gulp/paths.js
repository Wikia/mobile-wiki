/*
 * Path list for tasks
 */
var path = require('path'),
	basePath = 'www',
	baseServer = basePath + '/server',
	baseFront = basePath + '/front';

module.exports = {
	base: basePath,
	baseFull: path.resolve(basePath),
	baseFullServer: path.resolve(baseServer),
	baseFullFront: path.resolve(baseFront),
	vendor: {
		src: 'front/vendor/**/*',
		dest: basePath + '/front/vendor',
		original: 'front/vendor'
	},
	locales: {
		src: 'front/locales/**/*.json',
		dest: basePath + '/front/locales'
	},
	styles: {
		src: 'front/styles',
		watch: 'front/styles/**/*.scss',
		dest: basePath + '/front/styles',
		partials: '_*.scss',
		compile: '*.scss'
	},
	scripts: {
		front: {
			src: 'front/scripts',
			dest: basePath + '/front/scripts',
			jsFiles: '**/*.js'
		},
		server: {
			src: 'server/**/*.js',
			config: 'config/*.js',
			dest: basePath
		}
	},
	views: {
		src: 'server/views/**/*.+(hbs|js)',
		dest: basePath + '/server/views'
	},
	templates: {
		src: 'front/templates',
		dest: basePath + '/front/templates',
		files: '**/*.hbs'
	},
	symbols: {
		src: 'front/svg/symbols',
		dest: basePath + '/front/svg',
		files: '*.svg'
	},
	images: {
		src: ['front/svg/images/*', 'front/images/*'],
		dest: basePath + '/front/images'
	},
	nodeModules: {
		src: 'node_modules',
		dest: basePath + '/node_modules'
	},
	server: {
		script: basePath + '/server/server.js'
	},
	config: {
		path: 'config/',
		baseFile: 'localSettings.base.js',
		exampleFile: 'localSettings.example.js',
		runtimeFile: 'localSettings.js'
	}
};
