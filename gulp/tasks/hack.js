var gulp = require('gulp'),
	cache = require('gulp-cached'),
	paths = require('../paths').hack;

gulp.task('hack', function () {
	return gulp.src(paths.src)
		.pipe(cache('hack'))
		.pipe(gulp.dest(paths.dest));
});
