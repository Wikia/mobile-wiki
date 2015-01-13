var gulp = require('gulp'),
	typedoc = require('gulp-typedoc'),
	paths = require('../paths'),
	options = require('../options').doc.server;

gulp.task('docs-server', function() {
	return gulp
		.src([paths.scripts.server.src, paths.scripts.server.config])
		.pipe(typedoc(options));
});
