/*
 * scripts-server
 * Compiles server ts files
 */

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	gutil = require('gulp-util'),
	environment = require('../utils/environment'),
	newer = require('gulp-newer'),
	paths = require('../paths').scripts.server;

gulp.task('scripts-server', ['scripts-config'], function () {
	return gulp.src([paths.src, paths.config], {base: './'})
		.pipe(newer({dest: paths.dest, ext: '.js'}))
		.pipe(babel({
			presets: ['es2015'],
		}))
		.on('error', function () {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some ES6 errors/warnings');
				process.exit(1);
			}
		})
		.pipe(gulp.dest(paths.dest));
});

//Temporary alias
gulp.task('scripts-back', ['scripts-server']);
