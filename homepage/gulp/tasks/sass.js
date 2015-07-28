var gulp = require('gulp'),
	sass = require('gulp-sass'),
	path = require('path'),
	paths = require('../paths').styles.homepage;

gulp.task('sass', ['bower'], function () {
	gulp.src(paths.src)
	    .pipe(sass().on('error', sass.logError))
	    .pipe(gulp.dest(paths.dest));
});
