/*
 * build-combined
 * Combines templates/main.js, scripts/mercury.js, and scripts/main.js into scripts/combined.js
 */
var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	environment = require('../utils/environment'),
	rev = require('gulp-rev'),
	gulpconcat = require('gulp-concat'),
	piper = require('../utils/piper');

gulp.task('build-combined', ['scripts-front-modules-spa', 'scripts-front-modules-auth', 'scripts-front', 'templates'], function () {
	return piper(
		gulp.src([
			'www/front/templates/main.js',
			'www/front/scripts/modules-spa.js'
		]),
		gulpconcat('combined.js'),
		gulpif(environment.isProduction, piper(
			uglify(),
			rev()
		)),
		gulp.dest('www/front/scripts'),
		gulpif(environment.isProduction, piper(
			rev.manifest(),
			gulp.dest('www/front/scripts')
		))
	);
});
