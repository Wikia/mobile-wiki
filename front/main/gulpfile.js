/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0 */

var gulp = require('gulp'),
	spawn = require('child_process').spawn,
	path = require('path'),
	log = require('../../gulp/utils/logger');

gulp.task('build-watch-main', function (done) {
	var cmd = spawn('ember', ['build', '--watch'], {
		stdio: ['ignore', 1, 2],
		cwd: path.join(process.cwd(), 'front/main')
	});

	cmd.on('exit', function (code) {
		log('Ember build exited with code: ' + code);
		done();
	});

	// Stop Ember build if the gulp process exits
	process.once('exit', function () {
		cmd.kill();
	});
});
