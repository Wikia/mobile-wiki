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
		browsers: ['PhantomJS'],
		// coverage reporter generates the coverage
		reporters: ['progress', 'coverage'],

		preprocessors: {
			// source files, that you want to generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			'/**/front/scripts/*.js': ['coverage']
		},

		// optionally, configure the reporter
		coverageReporter: {
			dir : 'coverage/front',
			reporters: [
				{ type: 'cobertura', subdir: '.', file: 'cobertura.xml' }
			]
		}
	});
};
