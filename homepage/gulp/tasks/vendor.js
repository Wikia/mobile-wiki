var gulp = require('gulp'),
	paths = require('../paths').vendor.homepage,
	path = require('path');

gulp.task('vendor', function() {
	gulp.src([paths.src])
		.pipe(gulp.dest(paths.dest));
});
