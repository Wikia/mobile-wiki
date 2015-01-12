/*
 * Path list for tasks
 */
var path = require('path'),
	basePath = 'www';

module.exports = {
	base: basePath,
	baseFull: path.resolve(basePath),
	vendor: {
		src: 'front/vendor/**/*',
		dest: basePath + '/front/vendor'
	},
	locales: {
		src: 'front/locales/**/*.json',
		dest: basePath + '/front/locales'
	},
	styles: {
		src: ['!front/styles/_*.scss', 'front/styles/*.scss'],
		watch: 'front/styles/**/*.scss',
		dest: basePath + '/front/styles'
	},
	scripts: {
		front: {
			src: 'front/scripts',
			dest: basePath + '/front/scripts',
			files: '**/*.ts',
			dFiles: '**/*.d.ts'
		},
		back: {
			src: 'server/**/*.ts',
			config: 'config/*.ts',
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
		baseFile: 'localSettings.base.ts',
		exampleFile: 'localSettings.example.ts',
		testFile: 'localSettings.test.ts',
		runtimeFile: 'localSettings.ts'
	}
};
