var gulp = require('gulp'),
	piper = require('../utils/piper'),
	paths = require('../paths').images,
	path = require('path');

gulp.task('images', function () {
	return piper(
		gulp.src(path.join(paths.src, paths.files)),
		gulp.dest(paths.dest)
	);
});
