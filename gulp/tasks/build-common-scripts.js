/*
 * build-common-scripts
 * Compiles and concatenates common scripts
 */

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	gulpif = require('gulp-if'),
	newer = require('gulp-newer'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	environment = require('../utils/environment'),
	paths = require('../paths').scripts.common,
	path = require('path');

function buildCommonScripts(done, src, filename, moduleRoot) {
	var babelOptions = {
		presets: ['es2015']
	};

	if (moduleRoot) {
		babelOptions.plugins = ['transform-es2015-modules-amd', ['rename-define', {
			name: 'mefine'
		}]];
		babelOptions.moduleIds = true;
		babelOptions.moduleRoot = moduleRoot;
	}

	gulp.src(src, {
			base: './front/common/'
		})
		.pipe(newer(paths.dest.main))
		.pipe(babel(babelOptions))
		.on('error', function (error) {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some errors');
				process.exit(1);
			} else {
				console.error('Build error: ' + error.message);
				this.emit('end');
			}
		})
		.pipe(concat(filename))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest.main))
		.on('end', done);
}

gulp.task('build-common-scripts-baseline', function (done) {
	buildCommonScripts(done, paths.base + '/baseline/**/*.js', 'baseline.js');
});

gulp.task('build-common-scripts-modules-utils', function (done) {
	buildCommonScripts(done, [
		paths.base + '/modules/**/*.js',
		paths.base + '/utils/**/*.js',
	], 'common.js', 'common');
});

gulp.task('build-common-scripts', [
	'build-common-scripts-baseline',
	'build-common-scripts-modules-utils'
]);
