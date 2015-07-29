/*
 * server
 * Runs node.js server
 */

var gulp = require('gulp'),
	server = require('gulp-develop-server'),
	options = {
		path: 'server/index.js',
		env: process.env,
		killSignal: 'SIGKILL'
	};

gulp.task('server', ['build'], function () {
	server.listen(options);
});

// if anything happens kill server
process.on('exit', function () {
	server.kill();
});
