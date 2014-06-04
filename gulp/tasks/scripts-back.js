var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back;

gulp.task('scripts-back', function () {
	return gulp
		.src(paths.in)
		.pipe(typescript(options))
		.pipe(gulp.dest(paths.out));
});
