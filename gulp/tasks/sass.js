var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	options = require('../options').styles,
	paths = require('../paths').styles;

gulp.task('sass', function () {
	return gulp.src(paths.src)
		// .pipe(changed(paths.dest, { extension: '.css' }))
		.pipe(sass(options))
		//currently support for map is broken
		.pipe(prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
			cascade: false,
			map: false
		}))
		.pipe(gulp.dest(paths.dest));
});
