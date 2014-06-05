var gulp = require('gulp');

gulp.task('assets', [
	'sass',
	'tslint',
	'scripts-back',
	'scripts-front',
	'components',
	'templates',
	'sprites',
	'locales'
]);
