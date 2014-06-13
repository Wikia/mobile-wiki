var gulp = require('gulp'),
	paths = require('../paths'),
	browserSync = require('browser-sync');

gulp.task('browser-sync', ['assets', 'views', 'server'], function() {
	browserSync.init(paths.baseFull + '/**', {});
});
