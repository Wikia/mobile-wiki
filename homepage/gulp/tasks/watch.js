/*
 * watch
 * Rebuilds on file change while server is running
 */

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
	nodemon = require('gulp-nodemon'),
	server = require('gulp-develop-server'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
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
	gulp.watch(paths.styles.homepage.watch, ['sass', 'lint', 'tslint', browserSync.reload]);

	// Client Scripts
	gulp.watch(paths.scripts.homepage.watch, ['sass', 'lint', 'tslint', browserSync.reload]);

	// Server Scripts
	gulp.watch(paths.server.homepage.watch, ['sass', 'lint', 'tslint', browserSync.reload]);
});

//if anything happens kill server
process.on('exit', function () {
	server.kill();
});
