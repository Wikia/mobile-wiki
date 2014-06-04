var gulp = require('gulp'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	options = require('../options').svg,
	paths = require('../paths').svg;

gulp.task('sprites', function () {
	return gulp.src(paths.in)
		.pipe(svgmin())
		.pipe(sprites.svg(options))
		.pipe(gulp.dest(paths.out));
});
