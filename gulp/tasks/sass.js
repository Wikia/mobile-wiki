var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	piper = require('../utils/piper'),
	options = require('../options').styles,
	paths = require('../paths').styles;

gulp.task('sass', function () {
	return piper(
		gulp.src(paths.src),
		sass(options),
		//currently support for map is broken
		prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
			cascade: false,
			map: false
		}),
		gulp.dest(paths.dest)
	);
});
