var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('typings', folders(paths.src, function (folder) {
	return gulp.src(
			['!' + path.join(folder, paths.dFiles), path.join(folder, paths.files)], {
				cwd: paths.src
			}
		)
		.pipe(typescript({
			declaration: true,
			removeComments: true
		}))
		.pipe(gulpif(paths.dFiles, gulp.dest(path.join(paths.src + folder))));
}));
