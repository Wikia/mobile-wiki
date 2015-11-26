/*
 * node-test-watch
 * Watches for changes while test is running
 */

var gulp = require('gulp'),
	paths = require('../paths'),
	gutil = require('gulp-util'),
	log = require('../utils/logger');

gulp.task('node-test-watch', function () {
	gulp.watch(paths.scripts.server.src, ['scripts-server', 'node-test']).on('change', function (event) {
		log('Script for server changed:', gutil.colors.green(event.path));
	});
});
