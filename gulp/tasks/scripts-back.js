var gulp = require('gulp'),
	ts = require('gulp-type'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back,
	tsProject = ts.createProject(options);

gulp.task('scripts-back', ['scripts-config'], function () {
	return gulp.src([paths.src, paths.config], {base: './'})
		.pipe(ts(tsProject)).js
		.pipe(gulp.dest(paths.dest));
});
