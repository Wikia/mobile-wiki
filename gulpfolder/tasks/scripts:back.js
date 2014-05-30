var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	options = require('../options').scripts.back,
	pipe = require('multipipe'),
	paths = require('../paths').scripts.back;

gulp.task('scripts:back', function () {
	return pipe(
		gulp.src(paths.in),
		typescript(options),
		gulp.dest(paths.out)
	);
});
