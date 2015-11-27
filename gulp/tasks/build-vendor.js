/*
 * build-vendor
 * Combines vendor scripts into vendor/main.js
 */

var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	rev = require('gulp-rev'),
	gulpconcat = require('gulp-concat'),
	environment = require('../utils/environment'),
	uglify = require('gulp-uglify'),
	piper = require('../utils/piper');

gulp.task('build-vendor', ['vendor'], function () {
	return piper(
		gulp.src([
			'www/front/vendor/script.js/dist/script.js',
			'www/front/vendor/fastclick/lib/fastclick.js',
			'www/front/vendor/jquery/dist/jquery.js',
			'www/front/vendor/hammerjs/hammer.js',
			'www/front/vendor/headroom.js/dist/headroom.js',
			'www/front/vendor/jquery.cookie/jquery.cookie.js',
			(environment.isProduction ? 'www/front/vendor/ember/ember.prod.js' : 'www/front/vendor/ember/ember.debug.js'),
			'www/front/vendor/ember-hammer/ember-hammer.js',
			'www/front/vendor/i18next/i18next.js',
			'www/front/vendor/vignette/dist/vignette.js',
			'www/front/vendor/numeral/numeral.js',
			'www/front/vendor/weppy/dist/weppy.js',
			'www/front/vendor/visit-source/dist/visit-source.js',
			'www/front/vendor/Autolinker.js/dist/Autolinker.min.js',
			'www/front/vendor/ember-performance-sender/dist/ember-performance-sender.js'
		]),
		gulpconcat('main.js'),
		gulpif(environment.isProduction, piper(
			uglify(),
			rev()
		)),
		gulp.dest('www/front/vendor'),
		gulpif(environment.isProduction, piper(
			rev.manifest(),
			gulp.dest('www/front/vendor')
		))
	);
});
