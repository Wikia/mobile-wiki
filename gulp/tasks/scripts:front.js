var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	environment = require('../util/environment'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	filter = require('gulp-filter'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	jsFilter = filter('*.js');

gulp.task('scripts:front', function () {
	return gulp
		.src(paths.in)
		.pipe(changed(paths.out, { extension: '.js' }))
		.pipe(typescript(options))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.out))
});
