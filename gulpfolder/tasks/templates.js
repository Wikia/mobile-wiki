var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	pipe = require('multipipe'),
	environment = require('../util/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates;

gulp.task('templates', function () {
	return pipe(
		gulp.src(paths.in),
		changed(paths.out, { extension: '.js' }),
		handlebars(options),
		concat('main.js'),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.out)
	);
});
