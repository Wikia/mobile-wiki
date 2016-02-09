/*
 * sass
 * Compiles sass files
 */

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	options = require('../options').sass,
	paths = require('../paths').styles.homepage;

gulp.task('sass', ['vendor'], function () {
	gulp.src(paths.src)
	    .pipe(sass(options).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	    .pipe(gulp.dest(paths.dest));
});
