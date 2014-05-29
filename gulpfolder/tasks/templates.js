var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	rev = require('gulp-rev'),
	environment = require('../util/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates;

gulp.task('templates', function () {
	return gulp.src(paths.in)
		.pipe(handlebars(options))
		.pipe(concat('main.js'))
		.pipe(gulpif(environment === 'prod', uglify()))
		.pipe(rev())
		.pipe(gulp.dest(paths.out))
		.pipe(rev.manifest())
		.pipe(gulp.dest(paths.out));
});
