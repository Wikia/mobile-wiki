var gulp = require('gulp'),
	gzip = require('gulp-gzip'),
	environment = require('../utils/environment'),
	options = require('../options'),
	paths = require('../paths');

gulp.task('build', [
	'node-modules',
	'sass',
	'symbols',
	'images',
	'vendor',
	'templates',
	'locales',
	'scripts-back',
	'build-views'
], function(cb) {
	if (environment.isProduction) {
		return gulp.src([
			paths.base + '/public/**/*.json',
			paths.base + '/public/**/*.js',
			paths.base + '/public/**/*.css',
			paths.base + '/public/**/*.svg'
		])
			.pipe(gzip(options.gzip))
			.pipe(gulp.dest(paths.base + '/public'));
	}
	cb();
});
