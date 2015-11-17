/*
 * scripts-front
 * Compiles front scripts
 */

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	folders = require('gulp-folders'),
	gulpif = require('gulp-if'),
	// @todo Fix in https://wikia-inc.atlassian.net/browse/XW-562
	// newer = require('gulp-newer'),
	uglify = require('gulp-uglify'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', folders(paths.src, function (folder) {
	// build ES6
	if (folder === 'main' || folder === 'mercury') {
		return gulp.src([]);
	}

	var esStream = gulp.src([
		path.join(paths.src, folder, paths.jsFiles)
	])
	// @todo Fix in https://wikia-inc.atlassian.net/browse/XW-562
	// .pipe(newer(path.join(paths.dest, folder + '.js')))
	.pipe(babel({
		presets: ['es2015'],
		plugins: ['transform-es2015-modules-umd']
	}));

	return esStream
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
