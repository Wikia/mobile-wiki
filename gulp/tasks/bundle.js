var gulp = require('gulp');

gulp.task('bundle', [
	'sass',
	'node-modules',
	'scripts-back',
	'scripts-front',
	'vendor',
	'templates',
	'sprites',
	'locales',
	'build'
]);
