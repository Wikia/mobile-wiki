var gulp = require('gulp'),
	clean = require('gulp-clean'),
	pipe = require('multipipe'),
	options = require('../options').clean,
	paths = require('../paths');

gulp.task('clean', function () {
	return pipe(
		gulp.src(paths.base, options),
		clean()
	);
});
