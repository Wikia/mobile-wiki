var gulp = require('gulp'),
	paths = require('../paths').nodeModules,
	dependencies;

gulp.task('node-modules', function () {
	var deps;

	try {
		dependencies = Object.keys(require('../../npm-shrinkwrap').dependencies);
	} catch (exception) {
		dependencies = Object.keys(require('../../package').dependencies);
	}

	deps = '/{' + dependencies.join('/**/*,') + '/**/*}';

	return gulp.src(paths.src + deps)
		.pipe(gulp.dest(paths.dest));
});
