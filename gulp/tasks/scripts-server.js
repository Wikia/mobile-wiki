var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	gutil = require('gulp-util'),
	environment = require('../utils/environment'),
	newer = require('gulp-newer'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back,
	tsProject = ts.createProject(options);

gulp.task('scripts-server', ['scripts-config'], function () {
	return gulp.src([paths.src, paths.config], {base: './'})
		.pipe(newer({dest: paths.dest, ext: '.js'}))
		.pipe(ts(tsProject)).js
		.on('error', function () {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some typescript errors/warnings');
				process.exit(1);
			}
		})
		.pipe(gulp.dest(paths.dest));
});
