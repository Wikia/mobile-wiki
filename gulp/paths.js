var path = require('path'),
	output = 'www',
	outputFront = output + '/mobile-wiki',
	outputServer = output + '/server',
	hbsPattern = '**/*.hbs',
	jsPattern = '**/*.js';

module.exports = {
	base: output,
	baseFull: path.resolve(output),
	baseFullServer: path.resolve(outputServer),
	baseFullFront: path.resolve(outputFront),
	jsPattern: jsPattern,

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
			baseFile: 'settings.base.js',
			exampleFile: 'settings.example.js',
			runtimeFile: 'settings.js'
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
