var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	rev = require('gulp-rev'),
	changed = require('gulp-changed'),
	pipe = require('multipipe'),
	options = require('../options').styles,
	paths = require('../paths').styles;

gulp.task('sass', function () {
	return pipe(
		gulp.src([paths.main, paths.aboveTheFold]),
		changed(paths.out, { extension: '.css' }),
		sass(options),
		//currently support for map is broken
		prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], { cascade: false, map: false }),
		gulp.dest(paths.out)
	);
});
