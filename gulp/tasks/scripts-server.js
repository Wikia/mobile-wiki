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

gulp.task('scripts-server', ['scripts-config'], function (done) {
	gulp.src([paths.src, paths.config], {base: './'})
		.pipe(newer({dest: paths.dest, ext: '.js'}))
		.pipe(babel({
			presets: ['es2015'],
		}))
		.on('error', function (error) {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some errors');
				process.exit(1);
			} else {
				console.error('Build error: ' + error.message);
				this.emit('end');
			}
		})
		.pipe(gulp.dest(paths.dest))
		.on('end', done);
});

//Temporary alias
gulp.task('scripts-back', ['scripts-server']);
