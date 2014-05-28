var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	environment = require('../util/environment'),
	gulpif = require('gulp-if'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front;

gulp.task('scripts:front', function () {
	return gulp
		.src(paths.in)
		.pipe(typescript(options))
		.pipe(gulpif(environment === 'prod', uglify()))
		.pipe(gulp.dest(paths.out));
});
