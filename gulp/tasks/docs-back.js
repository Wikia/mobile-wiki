var gulp = require('gulp'),
	typedoc = require('gulp-typedoc'),
	paths = require('../paths'),
	options = require('../options').doc.back;

gulp.task('docs-back', function() {
	return gulp
		.src([paths.scripts.back.src, paths.scripts.back.config])
		.pipe(typedoc(options));
});
