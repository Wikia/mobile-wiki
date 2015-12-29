var gulp = require('gulp'),
	rename = require('gulp-rename'),
	expect = require('gulp-expect-file'),
	paths = require('../paths'),
	dependencies = Object.keys(require('../../package').dependencies);

gulp.task('build-server-node-modules', function () {
	var deps = '/{' + dependencies.join('/**/*,') + '/**/*}';

	return gulp.src(paths.nodeModules.src + deps)
		.pipe(gulp.dest(paths.nodeModules.dest));
});

gulp.task('build-server-copy-ember-index', function () {
	return gulp.src(paths.views.mainIndex.src)
		.pipe(expect(paths.views.mainIndex.src))
		.pipe(rename(paths.views.mainIndex.outputFilename))
		.pipe(gulp.dest(paths.views.mainIndex.dest));
});

gulp.task('build-server-views', ['build-server-copy-ember-index'], function () {
	return gulp.src(paths.views.src, {
			base: paths.baseFullServer
		})
		.pipe(gulp.dest(paths.views.dest));
});

gulp.task('build-server', [
	'build-server-node-modules',
	'build-server-scripts',
	'build-server-views',
	'locales'
]);
