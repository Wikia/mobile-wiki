/*
 * scripts-front
 * Compiles front scripts
 */

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	folders = require('gulp-folders'),
	gulpif = require('gulp-if'),
	newer = require('gulp-newer'),
	uglify = require('gulp-uglify'),
	environment = require('../utils/environment'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', folders(paths.src, function (folder) {
	// main, mercury and auth folders are handled by scripts-front-modules
	if (folder === 'main' || folder === 'mercury' || folder === 'auth') {
		return gulp.src([]);
	}

	var esStream = gulp.src([
		path.join(paths.src, folder, paths.jsFiles)
	])
	.pipe(newer(path.join(paths.dest, folder + '.js')))
	.pipe(babel({
		presets: ['es2015']
	}));

	return esStream
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
