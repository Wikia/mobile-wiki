var folders = require('gulp-folders'),
	gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	piper = require('../utils/piper'),
	flip = require('../utils/flip'),
	options = require('../options').sass,
	path = require('path'),
	paths = require('../paths').styles;

gulp.task('sass', folders(paths.src, function (folder) {
	return piper(
		gulp.src([
			path.join(paths.src, folder, paths.compile),
			'!' + path.join(paths.src, folder, paths.partials)
		]),
		sass(options),
		prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
			cascade: false,
			map: false
		}),
		flip(),
		gulp.dest(path.join(paths.dest, folder))
	);
}));
