var spawn = require('child_process').spawn,
	path = require('path'),
	gulp = require('gulp');

gulp.task('node-test', ['scripts-back'], function () {
	var child = spawn('node', [path.resolve(__dirname, '../../test/node-qunit.runner.js')], {stdio: 'inherit'});

	child.on('exit', function(exitCode) {
		process.exit(exitCode);
	});
});
