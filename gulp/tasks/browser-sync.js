var gulp = require('gulp'),
	paths = require('../paths'),
	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync( {
		files: [
			paths.baseFull + '/**/*.+(js|hbs|css|svg)',
		],
		watchOptions: {
			debounceDelay: 100
		},
		reloadDelay: 300,
		ghostMode: {
			clicks: true,
				location: true,
				forms: true,
				scroll: true
		},
		open: false
	});
});
