var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	ts = require('gulp-typescript'),
	concat = require('gulp-concat'),
	gutil = require('gulp-util'),
	newer = require('gulp-newer'),
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
		.pipe(newer({dest: paths.dest, ext: '.js'}))
		.pipe(ts(tsProjects[folder])).js
		.on('error', function () {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some typescript errors/warnings');
				process.exit(1);
			}
		})
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
