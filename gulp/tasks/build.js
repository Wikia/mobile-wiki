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
	'scripts-server',
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
