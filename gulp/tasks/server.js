var gulp = require('gulp'),
	server = require('gulp-develop-server'),
	options = require('../options').server;

gulp.task('server', ['build', 'build-views'], function () {
	server.listen(options);
});

//if anything happens kill server
process.on('exit', function () {
	server.kill();
});
