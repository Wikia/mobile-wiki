var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	environment = require('../utils/environment'),
	paths = require('../paths').vendor;

gulp.task('vendor', function () {
	return gulp.src(paths.src)
		.pipe(changed(paths.dest, {
			extension: '.js'
		}))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
});
