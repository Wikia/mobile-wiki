module.exports = function (config) {
	config.set({
		frameworks: ['qunit'],
		autoWatch: true,
		singleRun: true,
		browsers: ['PhantomJS'],

		basePath: '../../../',
		files: [
			'dist/front/common/bower_components/loader.js/loader.js',
			'dist/front/common/bower_components/sinonjs/sinon.js',
			'dist/front/common/bower_components/jquery/dist/jquery.js',

			'dist/front/common/baseline.js',
			'dist/front/common/common.js',

			'front/common/tests/unit/**/*.js'
		]
	});
};
