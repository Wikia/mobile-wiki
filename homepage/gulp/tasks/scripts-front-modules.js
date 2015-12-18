/*
 * scripts-front
 * Compiles front js files
 */

var gulp = require('gulp'),
	Builder = require('systemjs-builder'),
	paths = require('../paths').scripts.homepage,
	environment = require('../utils/environment');

gulp.task('scripts-front-modules-homepage', function () {
	var builder = new Builder();

	builder.config({
		baseURL: paths.src,
		defaultJSExtensions: true,
	});

	return builder.buildStatic(
		'main/' + paths.files,
		paths.dest + '/modules-homepage.js',
		{
			minify: environment.isProduction
		}
	);
});
