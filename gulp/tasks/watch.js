/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0 */

var gulp = require('gulp'),
	path = require('path'),
	runSequence = require('run-sequence'),
	paths = require('../paths');

gulp.task('build-watch-run', function (done) {
	runSequence(
		'build-common',
		'build-auth',
		'build-server',
		[
			'build-watch-main',
			'watch-auth',
			'watch-common',
			'watch-server',
			'run-server'
		],
		done
	)
});
