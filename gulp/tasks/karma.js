var gulp = require('gulp'),
	karma = require('gulp-karma'),
	paths = require('../paths');

gulp.task('karma', ['assets'], function () {
	return gulp.src([
		paths.vendor.dest + '/main.js',
		paths.scripts.front.dest + '/main.js',
		paths.scripts.back.dest + '/main.js',
		// qunit helpers must not be included in general components package
		'public/vendor/ember-qunit/dist/globals/main.js',
		'test/helpers/**/*.js',
		'test/specs/**/*.js',
	])
	.pipe(karma({
		configFile: 'test/karma.conf.js',
		action: 'watch'
	}))
	.on('error', function (error) {
		throw error;
	});
});
