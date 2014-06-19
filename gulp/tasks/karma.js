var gulp = require('gulp'),
	karma = require('gulp-karma'),
	gutil = require('gulp-util'),
	paths = require('../paths');

gulp.task('karma', function () {
	return gulp.src([
		paths.vendor.dest + '/handlebars/handlebars.runtime.js',
		paths.vendor.dest + '/jquery/dist/jquery.js',
		paths.vendor.dest + '/ember/ember.js',
		paths.vendor.dest + '/i18next/i18next.js',
		paths.scripts.front.dest + '/baseline.js',
		paths.scripts.front.dest + '/main.js',
		paths.templates.dest + '/main.js',
		paths.scripts.back.dest + '/main.js',
		// qunit helpers must not be included in general components package
		'public/vendor/ember-qunit/dist/globals/main.js',
		'test/helpers/**/*.js',
		'test/specs/**/*.js',
		'test/integration/**/*.js',
	])
	.pipe(karma({
		configFile: 'test/karma.conf.js',
		action: gutil.env.action === 'watch' ? gutil.env.action : 'run'
	}))
	.on('error', function (error) {
		throw error;
	});
});
