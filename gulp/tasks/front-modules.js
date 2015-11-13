/*
 * scripts-front
 * Compiles front ts files
 */

var gulp = require('gulp'),
	Builder = require('systemjs-builder');

gulp.task('front-modules', function() {
	var builder = new Builder();
	builder.config({
		"baseURL": "front/scripts",
		defaultJSExtensions: true,
		paths: {
			state: 'baseline/mercury/utils/state'
		},
	});
	return builder
		.buildStatic('**/*.js', 'www/front/scripts/modules.js')
		.then(function() {
			console.log('Build complete');
		})
		.catch(function(err) {
			console.log('Build error');
			console.log(err);
		});
});
