/*
 * Path list for tasks
 */
var path = require('path'),
	basePath = 'www';

module.exports = {
	base: basePath,
	baseFull: path.resolve(basePath),
	components: {
		src: 'public/components/',
		dest: basePath + '/public/components'
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
			src: 'public/scripts/**/*.ts',
			dest: basePath + '/public/scripts'
		},
		back: {
			src: 'server/**/*.ts',
			dest: basePath
		}
	},
	views: {
		src: 'views/**/*',
		dest: basePath + '/views'
	},
	templates: {
		src: 'public/templates/**/*.hbs',
		dest: basePath + '/public/templates'
	},
	svg: {
		src: 'public/svg/*.svg',
		dest: basePath + '/public/svg'
	},
	nodemon: {
		script: basePath + '/server/app.js',
		watch: [
			basePath + '/server',
			basePath + '/views'
		]
	}
};
