/*
 * combine-svgs
 * Combines svg files into one, and place it in www/
 */

var gulp = require('gulp'),
	svgSymbols = require('gulp-svg-symbols'),
	folders = require('gulp-folders'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	rev = require('gulp-rev'),
	environment = require('../utils/environment'),
	piper = require('../utils/piper'),
	paths = require('../paths').symbols,
	path = require('path');

gulp.task('combine-svgs', folders(paths.src, function (folder) {
	return piper(
		gulp.src(path.join(paths.src, folder, paths.files)),
		svgSymbols(),
		gulpif('**/*.svg', piper(
			rename(folder + '.svg'),
			gulpif(environment.isProduction, piper(
				rev()
			)),
			gulp.dest(paths.dest)
		)),
		gulp.dest('www/front/svg'),
		gulpif(environment.isProduction, piper(
			rev.manifest(),
			gulp.dest('www/front/svg')
		))
	);
}));
