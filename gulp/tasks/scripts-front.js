var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	environment = require('../util/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front;

gulp.task('scripts-front', function () {
	return gulp
		.src(paths.src)
		.pipe(changed(paths.dest, { extension: '.js' }))
		.pipe(typescript(options))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
});
