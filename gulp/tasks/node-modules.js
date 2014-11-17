var gulp = require('gulp'),
	paths = require('../paths').nodeModules,
	dependencies = Object.keys(require('../../npm-shrinkwrap').dependencies);

gulp.task('node-modules', function () {
	var deps = '/{' + dependencies.join('/**/*,') + '/**/*}';

	return gulp.src(paths.src + deps)
		.pipe(gulp.dest(paths.dest));
});
