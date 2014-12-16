var gulp = require('gulp'),
	piper = require('../utils/piper'),
	paths = require('../paths').images;

gulp.task('images', function () {
	return piper(
		gulp.src(paths.src),
		gulp.dest(paths.dest)
	);
});
