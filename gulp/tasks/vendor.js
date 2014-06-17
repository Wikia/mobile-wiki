var gulp = require('gulp'),
	cache = require('gulp-cached'),
	multipipe = require('multipipe'),
	paths = require('../paths').vendor;

gulp.task('vendor', function () {
	return multipipe(
		gulp.src(paths.src),
		cache('vendor'),
		gulp.dest(paths.dest)
	);
});
