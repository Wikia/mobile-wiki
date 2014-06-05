var gulp = require('gulp'),
	gutil = require('gulp-util'),
	gulpif = require('gulp-if'),
	minifyHTML = require('gulp-minify-html'),
	fileInclude = require('gulp-file-include'),
	replace = require('gulp-replace-task'),
	path = require('path'),
	paths = require('../paths'),
	environment = require('../util/environment'),
	manifest,
	files;

function getPath(key) {
	return '/' + path.join(
		path.basename(path.dirname(key)),
		path.basename(key)
	);
}

function views() {
	files = [];

	try {
		manifest = require(paths.baseFull + '/public/rev-manifest.json');

		Object.keys(manifest).forEach(function (key) {
			files.push({
				match: getPath(key),
				replacement: getPath(manifest[key])
			});
		});
	} catch (exception) {
		gutil.log(exception.message);
	}

	return gulp.src(paths.views.src )
		.pipe(fileInclude({
			basepath: paths.baseFull
		}))
		.pipe(gulpif(environment.isProduction, minifyHTML()))
		.pipe(replace({
			patterns: files,
			prefix: '../public'
		}))
		.pipe(gulp.dest(paths.views.dest));
}

gulp.task('views', ['sprites', 'sass'], views);
gulp.task('views:revved', ['sprites', 'rev'], views);
