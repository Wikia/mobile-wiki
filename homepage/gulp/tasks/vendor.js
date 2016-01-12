/*
 * vendor
 * Copies vendor files into front directory
 */

var gulp = require('gulp'),
	paths = require('../paths').vendor.homepage;

gulp.task('vendor', ['bower'], function () {
	gulp.src([paths.src])
		.pipe(gulp.dest(paths.dest));
});
