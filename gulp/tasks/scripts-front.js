var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	piper = require('../utils/piper'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', folders(paths.src, function (folder) {
	//we need a copy of that object per folder
	var folderOptions = JSON.parse(JSON.stringify(options));

	folderOptions.out = folder + '.js';

	return piper(
		gulp.src(['!' + path.join(paths.src, folder, paths.dFiles), path.join(paths.src, folder, paths.files)]),
		typescript(folderOptions),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.dest)
	);
}));
