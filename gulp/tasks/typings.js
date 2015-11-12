/*
 * typings
 * Compiles Typescript files
 */

var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	folders = require('gulp-folders'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('typings', folders(paths.src, function (folder) {
	return gulp.src(
			['!' + path.join(folder, paths.tsdFiles), path.join(folder, paths.tsFiles)], {
				cwd: paths.src
			}
		)
		.pipe(ts({
			declaration: true,
			removeComments: true
		})).dts
		.pipe(gulp.dest(path.join(paths.src + folder)));
}));
