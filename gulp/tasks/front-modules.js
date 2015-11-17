/*
 * scripts-front
 * Compiles front ts files
 */

var gulp = require('gulp'),
	environment = require('../utils/environment'),
	Builder = require('systemjs-builder');

gulp.task('front-modules', function () {
	var builder = new Builder();

	builder.config({
		baseURL: 'front/scripts/',
		defaultJSExtensions: true,
	});

	return builder
		.buildStatic('main/**/*.js + mercury/**/*.js', 'www/front/scripts/modules.js', {
			minify: environment.isProduction
		});
});
