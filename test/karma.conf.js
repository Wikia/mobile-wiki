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
		browsers: ['PhantomJS']
	});
};
