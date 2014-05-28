var gulp = require('gulp'),
	paths = require('../paths').views;

gulp.task('views', function() {
	gulp.src(paths.in)
		.pipe(gulp.dest(paths.out));
});
