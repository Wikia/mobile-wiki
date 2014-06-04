/*
 * Path list for tasks
 */

var environment = require('./utils/environment'),
	path = require('path'),
	basePath = 'www';

module.exports = {
	base: basePath,
	baseFull: path.resolve(basePath),
	components: {
		in: 'public/components/',
		out: basePath + '/public/components'
	},
	locales: {
		in: 'public/locales/**/*.json',
		out: basePath + '/public/locales'
	},
	styles: {
		main: 'public/styles/app.scss',
		aboveTheFold: 'public/styles/baseline.scss',
		watch: 'public/styles/**/*.scss',
		out: basePath + '/public/styles'
	},
	scripts: {
		front: {
			in: 'public/scripts/**/*.ts',
			out: basePath + '/public/scripts'
		},
		back: {
			in: 'server/**/*.ts',
			out: basePath
		}
	},
	views: {
		in: 'views/**/*',
		out: basePath + '/views'
	},
	templates: {
		in: 'public/templates/**/*.hbs',
		out: basePath + '/public/templates'
	},
	svg: {
		in: 'public/svg/*.svg',
		out: basePath + '/public/svg'
	},
	nodemon: {
		script: basePath + '/server/app.js',
		watch: [
			basePath + '/server',
			basePath + '/views'
		]
	}
};
