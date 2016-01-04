var gulp = require('gulp'),
	compile = require('../../gulp/utils/compile-es6-modules'),
	paths = require('../../gulp/paths'),
	pathsCommon = paths.common;

/*
 * Compile baseline script
 */
gulp.task('build-common-scripts-baseline', function (done) {
	var src = pathsCommon.src + '/baseline/' + paths.jsPattern;

	compile(done, src, 'front/common', pathsCommon.dest, 'baseline.js');
});

/*
 * Compile modules and utils to common.js
 */
gulp.task('build-common-scripts-modules-utils', function (done) {
	var src = [
		pathsCommon.src + '/modules/' + paths.jsPattern,
		pathsCommon.src + '/utils/' + paths.jsPattern,
	];

	compile(done, src, 'front/common', pathsCommon.dest, 'common.js', 'common');
});

/*
 * Copy all files from /front/common/public/ to /dist/front/common/
 */
gulp.task('build-common-public', function () {
	return gulp.src(pathsCommon.src + '/public/**/*')
		.pipe(gulp.dest(pathsCommon.dest));
});

/*
 * Copy baseline.js and common.js to /front/main/vendor/
 */
gulp.task('build-common-for-main', function () {
	var src = [
		pathsCommon.dest + '/baseline.js',
		pathsCommon.dest + '/common.js'
	];

	return gulp.src(src)
		.pipe(gulp.dest(pathsCommon.main.dest));
});

gulp.task('build-common', [
	'build-common-scripts-baseline',
	'build-common-scripts-modules-utils',
	'build-common-public',
	'build-common-for-main'
]);
