/*
 * watch
 * Rebuilds on file change while server is running
 */

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	server = require('gulp-develop-server'),
	browserSync = require('browser-sync'),
	paths = require('../paths');

gulp.task('watch', ['build-combined'], function () {
	if (!gutil.env.nosync) {
		browserSync({
			ghostMode: false,
			logLevel: 'silent',
			open: false
		});
	}

	server.listen({ path: paths.server.homepage.script });

	// Restart server
	gulp.watch(paths.server.homepage.watch, function (event) {
		console.log('Restarting server due to file change: ' +  event.path);
		server.restart();
	});

	// Sass
	gulp.watch(paths.styles.homepage.watch, ['sass', 'lint', 'eslint', browserSync.reload]);

	// Client Scripts
	gulp.watch(paths.scripts.homepage.watch, ['build-combined', browserSync.reload]);

	// Server Scripts
	gulp.watch(paths.server.homepage.watch, ['lint', browserSync.reload]);
});

//if anything happens kill server
process.on('SIGINT', function () {
	console.log('killing');
	server.kill();
});
