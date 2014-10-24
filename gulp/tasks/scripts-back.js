var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.back,
	paths = require('../paths').scripts.back,
	tsProject = ts.createProject(options);

gulp.task('scripts-back', ['scripts-config'], function () {
	return gulp.src([paths.src, paths.config], {base: './'})
		.pipe(ts(tsProject)).js
		.on('error', function () {
			if (environment.isProduction) {
				console.error('Build contains some typescript errors/warnings');
				process.exit(1);
			}
		})
		.pipe(gulp.dest(paths.dest));
});
