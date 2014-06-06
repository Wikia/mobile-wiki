var gulp = require('gulp'),
	paths = require('../paths');

gulp.task('locales', function () {
	return gulp.src(paths.locales.src)
		.pipe(gulp.dest(paths.locales.dest));
});
