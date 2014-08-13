var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	concat = require('gulp-concat'),
	piper = require('../utils/piper'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', folders(paths.src, function (folder) {
	options.out = folder + '.js';

	return piper(
		gulp.src(path.join(paths.src, folder, paths.files)),
		typescript(options),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.dest)
	);
}));
