var gulp = require('gulp'),
	tslint = require('gulp-tslint'),
	cache = require('gulp-cached'),
	multipipe = require('multipipe'),
	paths = require('../paths'),
	options = require('../options').tslint;

gulp.task('tslint', function () {
	return multipipe(
		gulp.src([
			paths.scripts.front.src + paths.scripts.front.files,
			paths.scripts.back.src
		]),
		cache('tslint'),
		tslint(),
		tslint.report('verbose', options)
	);
});
