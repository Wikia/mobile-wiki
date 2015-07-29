/*
 * vendor
 * Copies vendor files into front directory
 */

var gulp = require('gulp'),
	paths = require('../paths').vendor.homepage;

gulp.task('vendor', function () {
	gulp.src([paths.src])
		.pipe(gulp.dest(paths.dest));
});
