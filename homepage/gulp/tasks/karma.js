/*
 * karma
 * Run unit tests
 */

var gulp = require('gulp'),
	path = require('path'),
	Server = require('karma').Server;

gulp.task('karma', function (done) {
	new Server({
		configFile: path.join(__dirname, '../../test/karma.conf.js'),
		singleRun: true
	}, done).start();
});
