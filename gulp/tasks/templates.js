var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	multipipe = require('multipipe'),
	environment = require('../utils/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates,
	path = require('path');

gulp.task('templates', folders(paths.src, function (folder) {
	return multipipe(
		gulp.src(path.join(paths.src, folder, paths.files)),
		handlebars(options),
		concat(folder + '.js'),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.dest)
	);
}));
