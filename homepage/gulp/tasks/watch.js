/*
 * watch
 * Rebuilds on file change while server is running
 */

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	paths = require('../paths'),
	options = {
		path: ['server/index.js'],
		env: process.env,
		killSignal: 'SIGKILL'
	};

gulp.task('watch', ['build-combined'], function () {
	if (!gutil.env.nosync) {
		browserSync({
			ghostMode: false,
			logLevel: 'silent',
			open: false
		});
	}

	nodemon({
		script: 'server/index.js',
		ext: 'js html',
		env: { 'NODE_ENV': options.env },
		tasks: ['lint', 'eslint'],
	}).on('start', function () {
		reload(path);
	});

	// Sass
	gulp.watch(paths.styles.homepage.watch, ['sass', 'lint', 'eslint', browserSync.reload]);

	// Client Scripts
	gulp.watch(paths.scripts.homepage.watch, ['sass', 'lint', 'eslint', browserSync.reload]);

	// Server Scripts
	gulp.watch(paths.server.homepage.watch, ['sass', 'lint', 'eslint', browserSync.reload]);
});
