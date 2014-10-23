var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	ts = require('gulp-typescript'),
	concat = require('gulp-concat'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path'),
	tsProjects = {};

gulp.task('scripts-front', folders(paths.src, function (folder) {
	//we need project per folder
	if (!tsProjects[folder]) {
		tsProjects[folder] = ts.createProject(options);
	}

	return gulp.src([path.join(paths.src, folder, paths.files)])
		.pipe(ts(tsProjects[folder])).js
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
