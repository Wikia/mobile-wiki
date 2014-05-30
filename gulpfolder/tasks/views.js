var gulp = require('gulp'),
	filter = require('gulp-filter'),
	gulpif = require('gulp-if'),
	minifyHTML = require('gulp-minify-html'),
	fileInclude = require('gulp-file-include'),
	pipe = require('multipipe'),
	path = require('path'),
	paths = require('../paths'),
	environment = require('../util/environment');

gulp.task('views', ['assets'], function() {
	return gulp.src(paths.views.in)
		.pipe(fileInclude({
			basepath: paths.baseFull
		}))
		.pipe(gulpif(environment.isProduction, minifyHTML()))
		.pipe(gulp.dest(paths.views.out))
});
