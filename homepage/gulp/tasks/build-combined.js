/*
 * build-combined
 * Combines templates/main.js, scripts/mercury.js, and scripts/main.js into scripts/combined.js
 */
var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	environment = require('../../../gulp/utils/environment.js'),
	rev = require('gulp-rev'),
	gulpconcat = require('gulp-concat'),
	piper = require('../../../gulp/utils/piper');

gulp.task('build-combined', ['scripts'], function () {
	return piper(
		gulp.src([
			'front/js/main.js'
		]),
		gulpconcat('combined.js'),
		gulpif(environment.isProduction, piper(
			uglify(),
			rev()
		)),
		gulp.dest('front/js'),
		gulpif(environment.isProduction, piper(
			rev.manifest(),
			gulp.dest('front/js')
		))
	);
});
