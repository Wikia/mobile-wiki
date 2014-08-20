var spawn = require('child_process').spawn,
	path = require('path'),
	gulp = require('gulp'),
	gutil = require('gulp-util');

gulp.task('node-test', ['scripts-back'], function () {
	var child = spawn('node', [path.resolve(__dirname, '../../test/node-qunit.runner.js')], {stdio: 'inherit'});

	if (gutil.env.action && gutil.env.action === 'watch') {
		gulp.start('node-test-watch');
		gutil.env.action = 'watching';
	}

	if (gutil.env.action !== 'watch' || gutil.env.action !== 'watching') {
		child.on('exit', function(exitCode) {
			process.exit(exitCode);
		});
	}
});
