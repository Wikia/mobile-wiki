var gulp = require('gulp'),
	svgSymbols = require('gulp-svg-symbols'),
	folders = require('gulp-folders'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	piper = require('../utils/piper'),
	paths = require('../paths').svg,
	path = require('path');

gulp.task('sprites', folders(paths.src, function (folder) {
	return piper(
		gulp.src(path.join(paths.src, folder, paths.files)),
		gulpif(folder !== 'external', piper(
			svgSymbols(),
			gulpif('**/*.svg', piper(
				rename(folder + '.svg'),
				gulp.dest(paths.dest)
			))
		)),
		gulpif(folder === 'external', piper(
			gulp.dest(paths.dest)
		))
	);
}));
