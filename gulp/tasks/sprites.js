var gulp = require('gulp'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	concat = require('gulp-concat'),
	folders = require('gulp-folders'),
	multipipe = require('multipipe'),
	options = require('../options').svg,
	paths = require('../paths').svg,
	path = require('path');

gulp.task('sprites', folders(paths.src, function (folder) {
	return multipipe(
		gulp.src(path.join(paths.src, folder, paths.files)),
		svgmin(),
		sprites.svg(options),
		concat(folder + '.svg'),
		gulp.dest(paths.dest)
	);
}));
