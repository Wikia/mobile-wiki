module.exports = function (config) {
	config.set({
		frameworks: ['qunit'],
		autoWatch: true,
		singleRun: true,
		browsers: ['PhantomJS'],

		basePath: '../../../',
		files: [
			'dist/front/auth/bower_components/jquery/dist/jquery.js',
			'dist/front/auth/bower_components/loader.js/loader.js',
			'dist/front/auth/bower_components/sinonjs/sinon.js',

			'dist/front/common/common.js',
			'dist/front/common/baseline.js',

			'dist/front/auth/assets/**/*.js',

			'front/auth/tests/unit/common/**/*.js',
			'front/auth/tests/unit/signup/**/*.js'
		]
	});
};
