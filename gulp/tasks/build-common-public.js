/*
 * Copy front/common/public to dist/
 */

var gulp = require('gulp'),
	paths = require('../paths');

gulp.task('build-common-public', function () {
	return gulp.src(paths.common.public.src)
		.pipe(gulp.dest(paths.common.public.dest));
});
