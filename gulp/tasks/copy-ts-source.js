var gulp = require('gulp'),
	environment = require('../utils/environment'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('copy-ts-source', [ 'scripts-front' ], function() {
	var src  = path.join(paths.src, '/**/*'),
	    dest = path.join(paths.dest, process.cwd());

	if (!environment.isProduction) {
		gulp.src([src])
			.pipe(gulp.dest(dest));
	}
});
