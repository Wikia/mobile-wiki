module.exports = function (config) {
	config.set({
		frameworks: ['qunit'],
		autoWatch: true,
		singleRun: true,
		browsers: ['PhantomJS'],

		basePath: '../../../',
		files: [
			'www/front/auth/bower_components/crypto-js/core.js',
			'www/front/auth/bower_components/crypto-js/sha1.js',
			'www/front/auth/bower_components/jquery/dist/jquery.js',
			'www/front/auth/bower_components/loader.js/loader.js',
			'www/front/auth/bower_components/sinonjs/sinon.js',

			'www/front/common/common.js',
			'www/front/common/baseline.js',

			'www/front/auth/assets/**/*.js',

			'front/auth/tests/unit/common/**/*.js',
			'front/auth/tests/unit/signup/**/*.js'
		]
	});
};
