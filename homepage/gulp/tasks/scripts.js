/*
 * scripts-es6
 * Compiles client ES6 files
 */

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	folders = require('gulp-folders'),
	environment = require('../utils/environment.js'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.homepage,
	path = require('path');

gulp.task('scripts', ['eslint'], folders(paths.src, function (folder) {
	return gulp.src([
		'!' + path.join(paths.src, folder),
		path.join(paths.src, folder, paths.files)
	])
		.pipe(babel({
			presets: ['babel-preset-es2015'],
			plugins: ['transform-runtime'],
//			plugins: ['transform-runtime', 'transform-es2015-modules-umd'],
		}))
//		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
