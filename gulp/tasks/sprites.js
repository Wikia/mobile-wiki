var gulp = require('gulp'),
	svgSymbols = require('gulp-svg-symbols'),
	folders = require('gulp-folders'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	multipipe = require('multipipe'),
	paths = require('../paths').svg,
	path = require('path');

gulp.task('sprites', folders(paths.src, function (folder) {
	return multipipe(
		gulp.src(path.join(paths.src, folder, paths.files)),
		svgSymbols(),
		gulpif('**/*.svg', multipipe(
			rename(folder + '.svg'),
			gulp.dest(paths.dest)
		))
	);
}));
