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

function combineSvgFolder(folder) {
	return piper(
		gulp.src(path.join(paths.src, folder, paths.files)),
		svgSymbols(),
		gulpif('**/*.svg', piper(
			rename(folder + '.svg'),
			gulpif(environment.isProduction, rev()),
			gulp.dest(paths.dest)
		)),
		gulpif(environment.isProduction, piper(
			rev.manifest('rev-manifest-' + folder + '.json'),
			gulp.dest(paths.dest)
		))
	);
}

gulp.task('combine-svg-common', function() {
	return combineSvgFolder('common');
});

gulp.task('combine-svg-discussion', function() {
	return combineSvgFolder('discussion');
});

gulp.task('combine-svg-main', function() {
	return combineSvgFolder('main');
});

gulp.task('combine-svg-social', function() {
	return combineSvgFolder('social');
});

gulp.task('combine-svgs',
	['combine-svg-common', 'combine-svg-discussion', 'combine-svg-main', 'combine-svg-social'],
	function() {

});
