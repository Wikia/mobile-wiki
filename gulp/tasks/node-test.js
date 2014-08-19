var spawn = require('child_process').spawn,
	path = require('path'),
	gulp = require('gulp');

gulp.task('node-test', ['scripts-back'], function () {
	var child = spawn('node', [path.resolve(__dirname, '../../test/node-qunit.runner.js')], {stdio: 'inherit'});

	if (gulp.env.action && gulp.env.action === 'watch') {
		gulp.start('node-test-watch');
		gulp.env.action = 'watching';
	}

	if (gulp.env.action !== 'watch' || gulp.env.action !== 'watching') {
		child.on('exit', function(exitCode) {
			process.exit(exitCode);
		});
	}
});
