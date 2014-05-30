var gulp = require('gulp'),
	handlebars = require('gulp-ember-handlebars'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	concat = require('gulp-concat'),
	pipe = require('multipipe'),
	options = require('../options').svg,
	paths = require('../paths').svg;

gulp.task('sprites', function () {
	return pipe(
		gulp.src(paths.in),
		svgmin(),
		sprites.svg(options),
		gulp.dest(paths.out)
	);
});
