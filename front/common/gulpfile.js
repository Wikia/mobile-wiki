var gulp = require('gulp'),
	compile = require('../../gulp/utils/compile-es6-modules'),
	paths = require('../../gulp/paths'),
	pathsCommon = paths.common,
	pathsScripts = pathsCommon.scripts,
	pathsPublic = pathsCommon.public;

/*
 * Compile baseline script
 */
gulp.task('build-common-scripts-baseline', function (done) {
	var src = pathsScripts.src + '/baseline/' + paths.jsPattern;

	compile(done, src, 'front/common', pathsCommon.dest, 'baseline.js');
});

/*
 * Compile modules and utils to common.js
 */
gulp.task('build-common-scripts-modules-utils', function (done) {
	var src = [
		pathsScripts.src + '/modules/' + paths.jsPattern,
		pathsScripts.src + '/utils/' + paths.jsPattern,
	];

	compile(done, src, 'front/common', pathsCommon.dest, 'common.js', 'common');
});

/*
 * Copy all files from /front/common/public/ to /dist/front/common/
 */
gulp.task('build-common-public', function () {
	return gulp.src(pathsPublic.src)
		.pipe(gulp.dest(pathsCommon.dest));
});

/*
 * Main app depends on these assets
 */
gulp.task('build-common-for-main', [
	'build-common-scripts-baseline',
	'build-common-scripts-modules-utils',
	'build-common-public'
], function () {
	var src = [
		pathsCommon.dest + '/baseline.js',
		pathsCommon.dest + '/common.js'
	];

	return gulp.src(src)
		.pipe(gulp.dest(pathsCommon.destMain));
});

gulp.task('build-common', [
	'build-common-scripts-baseline',
	'build-common-scripts-modules-utils',
	'build-common-public'
]);
