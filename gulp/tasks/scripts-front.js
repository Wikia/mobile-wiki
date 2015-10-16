/*
 * scripts-front
 * Compiles front ts files
 */

var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	folders = require('gulp-folders'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	orderedMergeStream = require('ordered-merge-stream'),
	// TODO Fix in https://wikia-inc.atlassian.net/browse/XW-562
	// newer = require('gulp-newer'),
	ts = require('gulp-typescript'),
	uglify = require('gulp-uglify'),
	environment = require('../utils/environment'),
	options = require('../options').scripts.front,
	paths = require('../paths').scripts.front,
	path = require('path'),
	tsProjects = {};

gulp.task('scripts-front', folders(paths.src, function (folder) {
	var tsStream, esStream;

	// we need project per folder
	if (!tsProjects[folder]) {
		tsProjects[folder] = ts.createProject(options);
	}

	// build TS
	tsStream = gulp.src([
		'!' + path.join(paths.src, folder, paths.tsdFiles),
		path.join(paths.src, folder, paths.tsFiles)
	])
	// TODO Fix in https://wikia-inc.atlassian.net/browse/XW-562
	// .pipe(newer(path.join(paths.dest, folder + '.js')))
	.pipe(ts(tsProjects[folder])).js
	.on('error', function() {
		if (gutil.env.testing && environment.isProduction) {
			console.error('Build contains some typescript errors/warnings');
			process.exit(1);
		}
	});

	// build ES6
	esStream = gulp.src([
		path.join(paths.src, folder, paths.jsFilesMixins),
		path.join(paths.src, folder, paths.jsFilesRoutes),
		path.join(paths.src, folder, paths.jsFilesComponents)
	])
	// TODO Fix in https://wikia-inc.atlassian.net/browse/XW-562
	// .pipe(newer(path.join(paths.dest, folder + '.js')))
	.pipe(babel());

	return orderedMergeStream([tsStream, esStream])
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(paths.dest));
}));
