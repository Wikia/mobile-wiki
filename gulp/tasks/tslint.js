var gulp = require('gulp'),
	tslint = require('gulp-tslint'),
	cache = require('gulp-cached'),
	piper = require('../utils/piper'),
	paths = require('../paths'),
	options = require('../options').tslint;

gulp.task('tslint', function () {
	return piper(
		gulp.src([
			paths.scripts.front.src + paths.scripts.front.files,
			paths.scripts.server.src
		]),
		cache('tslint'),
		tslint(),
		tslint.report('verbose', options)
	);
});
