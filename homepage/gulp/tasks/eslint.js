/*
 * eslint
 * Lints ES6 files
 */

var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	paths = require('../paths');

gulp.task('eslint', function () {
	return gulp.src(paths.scripts.homepage.watch)
		.pipe(eslint())
		.pipe(eslint.format());
});
