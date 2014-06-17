var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	cache = require('gulp-cached'),
	multipipe = require('multipipe'),
	options = require('../options').styles,
	paths = require('../paths').styles;

gulp.task('sass', function () {
	return multipipe(
		gulp.src(paths.src),
		cache('sass'),
		sass(options),
		//currently support for map is broken
		prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
			cascade: false,
			map: false
		}),
		gulp.dest(paths.dest)
	);
});
