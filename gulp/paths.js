var path = require('path'),
	output = 'dist',
	outputFront = output + '/front',
	outputServer = output + '/server',
	hbsPattern = '**/*.hbs',
	jsPattern = '**/*.js';

module.exports = {
	base: output,
	baseFull: path.resolve(output),
	baseFullServer: path.resolve(outputServer),
	baseFullFront: path.resolve(outputFront),
	jsPattern: jsPattern,

	auth: {
		scripts: {
			base: './front/auth',
			src: 'front/auth/app/' + jsPattern,
			dest: outputFront + '/auth/assets'
		},
		styles: {
			src: 'front/auth/app/styles',
			dest: outputFront + '/auth/assets',
			partials: '_*.scss',
			compile: '*.scss'
		},
		vendor: {
			src: 'front/auth/bower_components/**/*',
			dest: outputFront + '/auth/bower_components'
		},
		views: {
			src: 'front/auth/views/' + hbsPattern,
			index: 'front/auth/views/_layouts/auth.hbs',
		},
	},
	common: {
		src: 'front/common',
		dest: outputFront + '/common',
		main: {
			dest: 'front/main/vendor',
		},
		revManifest: outputFront + '/common/rev-manifest.json'
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
			dest: outputServer + '/node_modules'
		},
		script: output + '/server/server.js',
		scripts: {
			src: 'server/app/' + jsPattern,
			config: 'server/config/' + jsPattern,
			dest: output
		},
		views: {
			src: 'server/app/views/' + hbsPattern,
			dest: outputServer + '/app/views',
			auth: {
				src: outputFront + '/auth/views/' + hbsPattern
			},
			main: {
				src: outputFront + '/main/index.html',
				dest: outputServer + '/app/views/_layouts',
				outputFilename: 'ember-main.hbs'
			}
		},
	},
	images: {
		src: ['front/svg/images/*', 'front/images/*'],
		dest: output + '/front/images'
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
