/*
 * build
 * Builds the entire application by invoking the other tasks
 */

var gulp = require('gulp'),
	gzip = require('gulp-gzip'),
	environment = require('../utils/environment'),
	options = require('../options'),
	paths = require('../paths');

gulp.task('build', [
	'node-modules',
	'sass',
	'combine-svgs',
	'combine-auth-svgs',
	'images',
	'vendor',
	'templates',
	'locales',
	'scripts-server',
	'build-vendor',
	'build-combined',
	'build-views'
], function(cb) {
	if (environment.isProduction) {
		return gulp.src([
			paths.base + '/front/**/*.json',
			paths.base + '/front/**/*.js',
			paths.base + '/front/**/*.css',
			paths.base + '/front/**/*.svg'
		])
			.pipe(gzip(options.gzip))
			.pipe(gulp.dest(paths.base + '/front'));
	}
	cb();
});
