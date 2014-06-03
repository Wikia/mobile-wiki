var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	rev = require('gulp-rev'),
	changed = require('gulp-changed'),
	options = require('../options').styles,
	paths = require('../paths').styles;

gulp.task('sass', function () {
	return gulp
		.src([paths.main, paths.aboveTheFold])
		// .pipe(changed(paths.out, { extension: '.css' }))
		.pipe(sass(options))
		//currently support for map is broken
		.pipe(prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], { cascade: false, map: false }))
		.pipe(gulp.dest(paths.out));
});
