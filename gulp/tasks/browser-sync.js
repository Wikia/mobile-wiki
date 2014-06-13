var gulp = require('gulp'),
	paths = require('../paths'),
	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync.init([
		paths.baseFull + '/**/*.js',
		paths.baseFull + '/**/*.css',
		paths.baseFull + '/**/*.hbs',
		paths.baseFull + '/**/*.svg'
	], {
		debounce: 100
	});
});
