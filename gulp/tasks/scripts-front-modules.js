/*
 * scripts-front
 * Compiles front js files
 */

var gulp = require('gulp'),
	Builder = require('systemjs-builder'),
	paths = require('../paths').scripts.front,
	environment = require('../utils/environment');

gulp.task('scripts-front-modules-spa', function () {
	var builder = new Builder();

	builder.config({
		baseURL: paths.src,
		defaultJSExtensions: true,
	});

	return builder.buildStatic(
		'main/' + paths.jsFiles + ' + mercury/' + paths.jsFiles,
		paths.dest + '/modules-spa.js',
		{
			minify: environment.isProduction
		}
	);
});

gulp.task('scripts-front-modules-auth', function () {
	var builder = new Builder();

	builder.config({
		baseURL: paths.src,
		defaultJSExtensions: true,
	});

	return builder.buildStatic(
		'auth/' + paths.jsFiles + ' + mercury/' + paths.jsFiles,
		paths.dest + '/modules-auth.js',
		{
			minify: environment.isProduction
		}
	);
});
