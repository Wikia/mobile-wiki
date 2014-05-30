var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	environment = require('../util/environment'),
	gulpif = require('gulp-if'),
	replace = require('gulp-replace'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	filter = require('gulp-filter'),
	pipe = require('multipipe'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	jsFilter = filter('*.js');

gulp.task('scripts:front', function () {
	return pipe(
		gulp.src(paths.in),
		changed(paths.out, { extension: '.js' }),
		typescript(options),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.out)
	);
});
