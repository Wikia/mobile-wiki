var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	concat = require('gulp-concat'),
	options = require('../options').svg,
	paths = require('../paths').svg;

gulp.task('sprites', function () {
	return gulp.src(paths.in)
		.pipe(svgmin())
		.pipe(sprites.svg(options))
		.pipe(gulp.dest(paths.out));
});
