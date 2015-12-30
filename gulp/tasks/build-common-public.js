/*
 * Copy front/common/public to dist/
 */

var gulp = require('gulp'),
	paths = require('../paths');

gulp.task('build-common-public', function () {
	gulp.src(paths.common.public.src).pipe(gulp.dest(paths.common.public.dest));
	gulp.src(paths.common.images.src).pipe(gulp.dest(paths.common.images.dest));
});
