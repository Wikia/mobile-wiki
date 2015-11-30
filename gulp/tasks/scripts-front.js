/*
 * scripts-front
 * Compiles front scripts
 */

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	gulpif = require('gulp-if'),
	newer = require('gulp-newer'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	environment = require('../utils/environment'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', function (done) {
	// it only builds baseline.js
	gulp.src([path.join(paths.src, 'baseline', paths.jsFiles)])
		.pipe(newer(path.join(paths.dest, 'baseline.js')))
		.pipe(babel({
			presets: ['es2015']
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
		.pipe(concat('baseline.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest))
		.on('end', done);
});
