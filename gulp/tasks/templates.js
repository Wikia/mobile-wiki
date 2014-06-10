var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	folders = require('gulp-folder'),
	environment = require('../utils/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates,
	path = require('path');

gulp.task('templates', folders(paths.src, function (folder) {
	return gulp.src(path.join(paths.src, folder, paths.files))
		.pipe(handlebars(options))
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
