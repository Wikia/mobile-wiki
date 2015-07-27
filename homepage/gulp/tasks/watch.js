var gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
    server = require('gulp-develop-server'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	paths = require('../paths');

gulp.task('watch', [ 'build' ], function () {
	if (!gutil.env.nosync) {
		browserSync({
			ghostMode: false,
			logLevel: 'silent',
			open: false
		});
	}

	// Sass
	gulp.watch(paths.styles.homepage.watch, ['sass']);

	// Client Scripts
	gulp.watch(paths.scripts.homepage.watch, ['scripts']);

	gulp.watch([
		paths.server.homepage.watch,
		paths.scripts.homepage.watch,
		paths.styles.homepage.watch
	]).on('change', function(event) {
		server.restart(function () {
			console.log('File changed: ' + gutil.colors.green(event.path) + '\nRestarting server');

			if (event.path.match('front')) {
				console.log('Updating browser');
				reload(path);
			}
		});
	});
});
