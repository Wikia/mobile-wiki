var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	options = require('../options').clean,
	paths = require('../paths');

gulp.task('clean', function () {
	return gulp
		.src(paths.base, options)
		.pipe(rimraf());
});
