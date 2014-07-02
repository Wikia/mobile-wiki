var gulp = require('gulp'),
	cache = require('gulp-cached'),
	paths = require('../paths').vendor;

gulp.task('vendor', function () {
	return gulp.src(paths.src)
		.pipe(cache('vendor'))
		.pipe(gulp.dest(paths.dest));
});
