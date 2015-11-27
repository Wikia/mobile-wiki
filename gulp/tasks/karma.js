/*
 * karma
 * Run unit tests
 */

var gulp = require('gulp'),
	Server = require('karma').Server,
	gutil = require('gulp-util');

// NOTE: fixtures task only gets run once, so need to restart karma if you change fixtures
gulp.task('karma', ['fixtures', 'scripts-test-modules', 'scripts-front'], function (done) {
	new Server({
		configFile: __dirname + '/../../test/karma.conf.js',
		action: gutil.env.action === 'watch' ? gutil.env.action : 'run'
	}, done).start();
});
