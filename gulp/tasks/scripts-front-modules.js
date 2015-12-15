/*
 * scripts-front
 * Compiles front js files
 */

var gulp = require('gulp'),
	Builder = require('systemjs-builder'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	gutil = require('gulp-util'),
	path = require('path'),
	paths = require('../paths').scripts.front,
	environment = require('../utils/environment');

gulp.task('scripts-front-modules-spa', function (done) {
	gulp.src([
			path.join(paths.src, 'main', paths.jsFiles),
			path.join(paths.src, 'mercury', paths.jsFiles),
		], {base: './front/scripts/'})
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-es2015-modules-amd', ['rename-define', {
				name: 'mdefine'
			}]],
			moduleIds: true
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
		.pipe(concat('modules-spa.js'))
		.pipe(gulp.dest(paths.dest))
		.on('end', done);
});

gulp.task('scripts-front-modules-auth', function () {
	var builder = new Builder();

	builder.config({
		baseURL: paths.src,
		defaultJSExtensions: true,
	});

	return builder.buildStatic(
		'auth/' + paths.jsFiles + ' + mercury/' + paths.jsFiles,
		paths.dest + '/modules-auth.js',
		{
			minify: environment.isProduction
		}
	);
});
