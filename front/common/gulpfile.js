/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0 */

var filter = require('gulp-filter'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	rev = require('gulp-rev'),
	svgSymbols = require('gulp-svg-symbols'),
	path = require('path'),
	runSequence = require('run-sequence'),
	compile = require('../../gulp/utils/compile-es6-modules'),
	environment = require('../../gulp/utils/environment'),
	piper = require('../../gulp/utils/piper'),
	paths = require('../../gulp/paths'),
	pathsCommon = paths.common,
	Server = require('karma').Server;

gulp.task('build-common-vendor-for-tests', function () {
	return piper(
		gulp.src(paths.common.vendor.src),
		gulp.dest(paths.common.vendor.dest)
	);
});

/*
 * Compile baseline script
 */
gulp.task('build-common-scripts-baseline', function (done) {
	compile(
		done, pathsCommon.baseline.src, 'front/common',
		pathsCommon.dest, pathsCommon.baseline.destFile
	);
});

/*
 * Compile modules and utils to common.js
 */
gulp.task('build-common-scripts-modules-utils', function (done) {
	compile(
		done, pathsCommon.modulesUtils.src, 'front/common',
		pathsCommon.dest, pathsCommon.modulesUtils.destFile, 'common'
	);
});

/*
 * Copy all files from /front/common/public/ to /www/front/common/
 */
gulp.task('build-common-public', function () {
	return gulp.src(pathsCommon.public.src)
		.pipe(gulp.dest(pathsCommon.dest));
});

/*
 * Build svg symbols
 */
gulp.task('build-common-symbols', function () {
	return piper(
		gulp.src(pathsCommon.svg.src),
		svgSymbols(),
		filter('**/*.svg'),
		rename('symbols.svg'),
		gulpif(environment.isProduction, piper(
			rev(),
			gulp.dest(pathsCommon.dest),
			rev.manifest('rev-manifest.json')
		)),
		gulp.dest(pathsCommon.dest)
	);
});

/*
 * Copy baseline.js and common.js to /front/main/vendor/
 */
gulp.task('build-common-for-main', function () {
	var src = [
		path.join(pathsCommon.dest, pathsCommon.baseline.destFile),
		path.join(pathsCommon.dest, pathsCommon.modulesUtils.destFile)
	];

	return gulp.src(src)
		.pipe(gulp.dest(pathsCommon.main.dest));
});

gulp.task('build-common', function (done) {
	runSequence(
		[
			'build-common-scripts-baseline',
			'build-common-scripts-modules-utils',
			'build-common-public',
			'build-common-symbols',
		],
		// It needs build-common-scripts-baseline and build-common-scripts-modules-utils to be finished
		// We need to use runSequence instead of gulp dependencies so watcher doesn't go into infinite loop
		'build-common-for-main',
		done
	);
});

gulp.task('watch-common', function () {
	var options = {
		debounceDelay: 500
	};

	gulp.watch(pathsCommon.baseline.src, options, ['build-common-scripts-baseline']);
	gulp.watch(pathsCommon.modulesUtils.src, options, ['build-common-scripts-modules-utils']);
	gulp.watch(pathsCommon.public.src, options, ['build-common-public']);
	gulp.watch(pathsCommon.svg.src, options, ['build-common-symbols']);
	gulp.watch([
		path.join(pathsCommon.dest, pathsCommon.baseline.destFile),
		path.join(pathsCommon.dest, pathsCommon.modulesUtils.destFile)
	], options, ['build-common-for-main']);
});

gulp.task('test-common', ['build-common-vendor-for-tests'], function (done) {
	new Server({
		configFile: __dirname + '/tests/karma.conf.js'
	}, done).start();
});

gulp.task('build-design-system-i18n', function () {
	var fs = require('fs'),
		i18n = '',
		i18nBuilt = {},
		loadTree = require('../../gulp/utils/load-tree'),
		tree = loadTree('node_modules/design-system-i18n/i18n');

	for(var dir in tree) {
		for(var file in tree[dir]) {
			i18n = require('../../node_modules/design-system-i18n/i18n/' + dir + '/' + file);
			i18nBuilt.main = i18n;

			fs.writeFile(
				'front/common/public/locales/' + dir + '/' + file,
				JSON.stringify(i18nBuilt, null, '  '),
				function(err) {
					if(err) {
						return console.log(err);
					}
				}
			);
		}
	}
});
