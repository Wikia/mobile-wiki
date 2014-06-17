var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	cache = require('gulp-cached'),
	environment = require('../utils/environment'),
	paths = require('../paths').vendor;

gulp.task('vendor', function () {
	return gulp.src(paths.src)
		.pipe(cache('vendor'))
		.pipe(gulp.dest(paths.dest));
});
