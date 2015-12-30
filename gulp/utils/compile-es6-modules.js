var gulp = require('gulp'),
	paths = require('../../gulp/paths'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	gulpif = require('gulp-if'),
	newer = require('gulp-newer'),
	uglify = require('gulp-uglify'),
	environment = require('../../gulp/utils/environment'),
	exitOnError = require('../../gulp/utils/exit-on-error');

/**
 * @param {Function} done
 * @param {*} src
 * @param {string} srcBase
 * @param {string} destDir
 * @param {string} destFile
 * @param {string=} moduleRoot
 */
module.exports = function (done, src, srcBase, destDir, destFile, moduleRoot) {
	var babelOptions = {
		presets: ['es2015']
	};

	if (moduleRoot) {
		babelOptions.plugins = ['transform-es2015-modules-amd'];
		babelOptions.moduleIds = true;
		babelOptions.moduleRoot = moduleRoot;
	}

	gulp.src(src, {
			base: srcBase
		})
		.pipe(newer(destDir))
		.pipe(babel(babelOptions))
		.on('error', exitOnError)
		.pipe(concat(destFile))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(destDir))
		.on('end', done);
};
