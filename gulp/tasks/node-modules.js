var gulp = require('gulp'),
	multipipe = require('multipipe'),
	paths = require('../paths').nodeModules,
	dependencies = Object.keys(require('../../package').dependencies);

gulp.task('node-modules', function () {
	var deps = '/{' + dependencies.join('/**/*,') + '/**/*}';

	return multipipe(
		gulp.src(paths.src + deps),
		gulp.dest(paths.dest)
	);
});
