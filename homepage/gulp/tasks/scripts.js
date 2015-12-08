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

gulp.task('scripts', ['eslint', 'scripts-front-modules-homepage'], folders(paths.src, function (folder) {
	return gulp.src([
		'!' + path.join(paths.src, folder),
		path.join(paths.src, folder, paths.files)
	])
		.pipe(babel({
			presets: ['es2015'],
		}))
		.pipe(gulp.dest(paths.dest));
}));
