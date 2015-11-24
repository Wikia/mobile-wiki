var paths = require('../gulp/paths');

/*
 * karma.conf.js
 * @description Karma configuration file. The src files are managed by the 'karma'
 * gulp task
 */
module.exports = function (config) {
	config.set({
		frameworks: ['qunit'],
		autoWatch: true,
		singleRun: true,
		browsers: ['Chrome'],
		// coverage reporter generates the coverage
		reporters: ['progress', 'coverage'],

		basePath: '../',
		files: [
			paths.vendor.dest + '/loader.js/loader.js',
			paths.vendor.dest + '/fastclick/lib/fastclick.js',
			paths.vendor.dest + '/sinonjs/sinon.js',
			paths.vendor.dest + '/sinon-qunit/lib/sinon-qunit.js',
			paths.vendor.dest + '/jquery/dist/jquery.js',
			paths.vendor.dest + '/ember/ember.debug.js',
			paths.vendor.dest + '/i18next/i18next.js',
			paths.vendor.dest + '/jquery.cookie/jquery.cookie.js',
			paths.vendor.dest + '/vignette/dist/vignette.js',
			paths.vendor.dest + '/weppy/dist/weppy.js',
			// qunit helpers must not be included in general components package
			'front/vendor/ember-qunit/ember-qunit.js',
			'test/fixtures/test-fixtures.js',
			paths.templates.dest + '/main.js',
			paths.scripts.front.dest + '/baseline.js',
			paths.scripts.front.dest + '/test-modules.js',
			paths.scripts.front.dest + '/auth.js',
			'test/helpers/**/*.js',
			'test/specs/front/scripts/mercury/modules/VideoLoader.js',
			'test/specs/front/scripts/mercury/modules/VideoPlayers/Base.js',
		],

		exclude: [
			// TODO fix these tests and remove this line, see CONCF-413
			'test/specs/front/scripts/main/helpers/*.js',
		],

		preprocessors: {
			// source files, that you want to generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			'/**/front/scripts/*.js': ['coverage']
		},

		// optionally, configure the reporter
		coverageReporter: {
			dir: 'coverage/front',
			reporters: [
				{type: 'cobertura', subdir: '.', file: 'cobertura.xml'}
			]
		}
	});
};
