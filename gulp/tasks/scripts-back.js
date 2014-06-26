var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	cache = require('gulp-cached'),
	multipipe = require('multipipe'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back;

gulp.task('scripts-back', function () {
	return multipipe(
		gulp.src(paths.src, {base: './'}),
		cache('scripts-back'),
		typescript(options),
		gulp.dest(paths.dest)
	);
});
