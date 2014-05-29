var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	environment = require('../util/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates;

gulp.task('templates', function () {
	return gulp.src(paths.in)
		.pipe(changed(paths.out, { extension: '.js' }))
		.pipe(handlebars(options))
		.pipe(concat('main.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(rev())
		.pipe(gulp.dest(paths.out))
		.pipe(rev.manifest())
		.pipe(gulp.dest(paths.out));
});
