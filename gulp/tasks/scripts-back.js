var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	cache = require('gulp-cached'),
	ts = require('gulp-type'),
	piper = require('../utils/piper'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back,
	tsProject = ts.createProject(options);

gulp.task('scripts-back', function () {
	return gulp.src(paths.src, {base: './'})
		.pipe(ts(tsProject)).js
		.pipe(gulp.dest(paths.dest));
});
