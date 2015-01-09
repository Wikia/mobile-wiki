var gulp = require('gulp'),
	paths = require('../paths'),
	gutil = require('gulp-util'),
	log = require('../utils/logger');

gulp.task('node-test-watch', function () {
	gulp.watch(paths.scripts.back.src, ['tslint', 'scripts-server', 'node-test']).on('change', function (event) {
		log('Script for backend changed:', gutil.colors.green(event.path));
	});
});
