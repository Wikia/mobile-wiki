var gulp = require('gulp'),
	clean = require('gulp-clean'),
	options = require('../options').clean,
	paths = require('../paths').clean;

gulp.task('clean', function () {
	return gulp
		.src(paths.base, options)
		.pipe(clean());
});
