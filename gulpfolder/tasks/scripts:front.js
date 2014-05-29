var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	environment = require('../util/environment'),
	gulpif = require('gulp-if'),
	rev = require('gulp-rev'),
	filter = require('gulp-filter'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	jsFilter = filter('*.js');

gulp.task('scripts:front', function () {
	return gulp
		.src(paths.in)
		.pipe(typescript(options))
		.pipe(gulpif(environment === 'prod', uglify()))
		.pipe(jsFilter)
		.pipe(rev())
		.pipe(jsFilter.restore())
		.pipe(gulp.dest(paths.out))
		.pipe(rev.manifest())
		.pipe(gulp.dest(paths.out));
});
