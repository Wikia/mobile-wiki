/*
 * Path list for tasks
 */

var environment = require('./util/environment'),
	basePaths = {
		dev: '.tmp',
		prod: 'www'
	},
	basePath = basePaths[environment];

module.exports = {
	base: basePath,
	components: {
		in: 'public/components/',
		out: basePath + '/public/components'
	},
	styles: {
		aboveTheFold: 'public/styles/aboveTheFold.scss',
		watch: 'public/styles/**/*.scss',
		main: 'public/styles/app.scss',
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
	templates: {
		in: 'public/templates/**/*.hbs',
		out: basePath + '/public/scripts'
	},
	svg: {
		in: 'public/svg/*.svg',
		out: basePath + '/public/svg'
	}
};
