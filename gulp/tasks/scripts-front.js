var gulp = require('gulp'),
	//typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	ts = require('gulp-type'),
	concat = require('gulp-concat'),
	piper = require('../utils/piper'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path'),
	tsProjects = {};

//var tsProjects = ts.createProject(options);

gulp.task('scripts-front', folders(paths.src, function (folder) {

	if ( !tsProjects[folder] ) {
		tsProjects[folder] = ts.createProject(options);
	}

	var tsResult = gulp.src([path.join(paths.src, folder, paths.files)])
		.pipe(ts(tsProjects[folder]));

	return tsResult.js
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
