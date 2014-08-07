var gulp = require('gulp');

gulp.task('assets', [
	'sass',
	'tslint',
	'scripts-back',
	'scripts-front',
	'templates',
	'sprites',
	'locales',
	'vendor',
	'hack'
]);
