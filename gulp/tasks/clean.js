var gulp = require('gulp'),
	del = require('del'),
	options = require('../options').clean,
	paths = require('../paths');

gulp.task('clean', function (cb) {
	del(paths.base, cb);
});
