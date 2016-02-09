/*
 * build-combined
 * Combines templates/main.js, scripts/mercury.js, and scripts/main.js into scripts/combined.js
 */
var gulp = require('gulp'),
	environment = require('../utils/environment.js'),
	gulpconcat = require('gulp-concat'),
	piper = require('../utils/piper');

gulp.task('build-combined', ['vendor', 'scripts'], function () {
	var src = [
		'vendor/jquery-bigtext/jquery-bigtext.js',
		'vendor/rsvp.js/rsvp.min.js',
		'vendor/slick-carousel/slick/slick.min.js',
		'front/js/modules-homepage.js'
	];

	if (!environment.isProduction) {
		src.push('front/js/dev.js');
	}

	return piper(
		gulp.src(src),
		gulpconcat('combined.js'),
		gulp.dest('front/js')
	);
});
