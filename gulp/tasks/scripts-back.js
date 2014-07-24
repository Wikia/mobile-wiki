var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	cache = require('gulp-cached'),
	piper = require('../utils/piper'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back;

gulp.task('scripts-back', function () {
	return piper(
		gulp.src(paths.src, {base: './'}),
		cache('scripts-back'),
		typescript(options),
		gulp.dest(paths.dest)
	);
});
