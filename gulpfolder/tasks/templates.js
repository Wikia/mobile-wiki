var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	environment = require('../util/environment'),
	options = require('../options').handlebars,
	paths = require('../paths').templates;

gulp.task('templates', function () {
	return gulp.src(paths.in)
		.pipe(handlebars(options))
		.pipe(concat('templates.js'))
		.pipe(gulpif(environment === 'prod', uglify()))
		.pipe(gulp.dest(paths.out));
});
