var gulp = require('gulp');

gulp.task('assets', [
	'sass',
	'scripts-back',
	'scripts-front',
	'components',
	'templates',
	'sprites',
	'locales'
]);
