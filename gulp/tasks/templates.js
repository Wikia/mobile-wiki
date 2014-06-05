var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	environment = require('../util/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates;

gulp.task('templates', function () {
	return gulp.src(paths.src)
		.pipe(changed(paths.dest, { extension: '.js' }))
		.pipe(handlebars(options))
		.pipe(concat('main.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
});
