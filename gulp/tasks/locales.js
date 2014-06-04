var gulp = require('gulp'),
	paths = require('../paths');

gulp.task('locales', function () {
	return gulp.src(paths.locales.in)
		.pipe(gulp.dest(paths.locales.out));
});
