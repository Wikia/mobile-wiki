module.exports = function (config) {
	config.set({
		frameworks: ['qunit'],
		autoWatch: true,
		singleRun: true,
		browsers: ['PhantomJS'],

		basePath: '../../../',
		files: [
			'www/front/common/bower_components/loader.js/loader.js',
			'www/front/common/bower_components/sinonjs/sinon.js',
			'www/front/common/bower_components/jquery/dist/jquery.js',

			'www/front/common/baseline.js',
			'www/front/common/common.js',

			'front/common/tests/unit/**/*.js'
		]
	});
};
