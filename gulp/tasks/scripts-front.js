var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	folders = require('gulp-folders'),
	concat = require('gulp-concat'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', folders(paths.src, function (folder) {
	return gulp
		.src(path.join(paths.src, folder, paths.files))
		.pipe(changed(paths.dest, {
			extension: '.js'
		}))
		.pipe(typescript(options))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(concat(folder + '.js'))
		.pipe(gulp.dest(paths.dest));
}));
