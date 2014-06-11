var gulp = require('gulp'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	rename = require('gulp-rename'),
	folders = require('gulp-folders'),
	options = require('../options').svg,
	paths = require('../paths').svg;
	path = require('path');

gulp.task('sprites', folders(paths.src, function (folder) {
	return gulp.src(path.join(paths.src, folder, paths.files))
		.pipe(svgmin())
		.pipe(sprites.svg(options))
		.pipe(rename(folder + '.svg'))
		.pipe(gulp.dest(paths.dest));
}));
