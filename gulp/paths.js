/*
 * Path list for tasks
 */
var path = require('path'),
	basePath = 'www';

module.exports = {
	base: basePath,
	baseFull: path.resolve(basePath),
	vendor: {
		src: 'public/vendor/**/*',
		dest: basePath + '/public/vendor'
	},
	locales: {
		src: 'public/locales/**/*.json',
		dest: basePath + '/public/locales'
	},
	styles: {
		src: ['!public/styles/_*.scss', 'public/styles/*.scss'],
		watch: 'public/styles/**/*.scss',
		dest: basePath + '/public/styles'
	},
	scripts: {
		front: {
			src: 'public/scripts',
			dest: basePath + '/public/scripts',
			files: '**/*.ts'
		},
		back: {
			src: 'server/**/*.ts',
			dest: basePath
		}
	},
	views: {
		src: 'views/**/*.+(hbs|js)',
		dest: basePath + '/views'
	},
	templates: {
		src: 'public/templates',
		dest: basePath + '/public/templates',
		files: '**/*.hbs'
	},
	svg: {
		src: 'public/svg',
		dest: basePath + '/public/svg',
		files: '*.svg'
	},
	nodeModules: {
		src: 'node_modules',
		dest: basePath + '/node_modules'
	},
	nodemon: {
		script: basePath + '/server/server.js',
		watch: [
			basePath + '/server',
			basePath + '/views',
			basePath + '/config'
		]
	}
};
