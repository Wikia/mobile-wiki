var gulp = require('gulp');

gulp.task('build-all', [
		'node-modules',
		'sass',
		'symbols',
		'images',
		'vendor',
		'templates',
		'locales',
		'scripts-back'
	], function () {
	return gulp.start('build-templates');
});


