var gulp = require('gulp'),
	del = require('del'),
	paths = require('../paths');

gulp.task('clean', function (cb) {
	del(paths.base, cb);
});
