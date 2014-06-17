var gulp = require('gulp'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	cache = require('gulp-cached'),
	concat = require('gulp-concat'),
	multipipe = require('multipipe'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-front', folders(paths.src, function (folder) {
	return multipipe(
		gulp.src(path.join(paths.src, folder, paths.files)),
		cache('scripts-front'),
		typescript(options),
		concat(folder + '.js'),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.dest)
	);
}));
