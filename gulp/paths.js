var path = require('path'),
	output = 'www',
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
			compile: '*.scss',
			watch: 'front/auth/app/styles/**/*.scss'
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
		baseline: {
			src: 'front/common/baseline/' + jsPattern,
			destFile: 'baseline.js'
		},
		designSystemI18n: {
			src: 'node_modules/design-system-i18n/i18n/**/*',
			dest: outputFront + '/common/locales',
		},
		main: {
			dest: 'front/main/vendor',
		},
		modulesUtils: {
			src: [
				'front/common/modules/' + jsPattern,
				'front/common/utils/' + jsPattern,
			],
			destFile: 'common.js'
		},
		public: {
			src: 'front/common/public/**/*'
		},
		revManifest: outputFront + '/common/rev-manifest.json',
		svg: {
			src: 'front/common/public/symbols/*.svg'
		},
		vendor: {
			src: 'front/common/bower_components/**/*',
			dest: outputFront + '/common/bower_components'
		}
	},
	server: {
		config: {
			src: 'server/config/',
			baseFile: 'localSettings.base.js',
			exampleFile: 'localSettings.example.js',
			runtimeFile: 'localSettings.js'
		},
		nodeModules: {
			src: 'server/node_modules',
			dest: outputServer + '/node_modules'
		},
		scripts: {
			src: [
				'server/app/' + jsPattern,
				'server/config/' + jsPattern
			],
			dest: output
		},
		views: {
			src: 'server/app/views/' + hbsPattern,
			dest: outputServer + '/app/views',
			auth: {
				src: outputFront + '/auth/views/' + hbsPattern
			},
			main: {
				/**
				 * when server watch starts 'main' folder is not there yet
				 * therefore we need to have ** here to allow file watchers to
				 * be able to fire event when file is added
				*/
				src: outputFront + '/**/ember-main.hbs',
				base: outputFront + '/main',
				dest: outputServer + '/app/views/_layouts',
			}
		},
	},
};
