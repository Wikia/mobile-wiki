module.exports = function (config) {
	config.set({
		frameworks: ['qunit'],
		autoWatch: true,
		singleRun: true,
		browsers: ['PhantomJS'],

		basePath: '../../../',
		files: [
			'www/mobile-wiki/common/bower_components/loader.js/loader.js',
			'www/mobile-wiki/common/bower_components/sinonjs/sinon.js',
			'www/mobile-wiki/common/bower_components/jquery/dist/jquery.js',

			'www/mobile-wiki/common/baseline.js',
			'www/mobile-wiki/common/common.js',

			'front/common/tests/unit/**/*.js'
		]
	});
};
