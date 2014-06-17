var gulp = require('gulp'),
	paths = require('../paths'),
	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync.init([
		paths.baseFull + '/**/*.+(js|hbs|css|svg)',
	], {
		ghostMode: {
			clicks: true,
			location: true,
			forms: true,
			scroll: true
		},
		open: false
	});
});
