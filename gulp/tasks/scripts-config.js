var fs = require('fs'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	conflict = require('gulp-conflict'),
	options = require('../options').scripts.back,
	config = require('../paths').config;

fileDoesNotExists = function (fileName) {
	if (fs.existsSync(fileName)) {
		return false;
	}
	return true;
}

gulp.task('script-config', function () {
	return gulp.src(config.path + config.exampleFile)
		.pipe(gulpif(fileDoesNotExists(config.path + config.runtimeFile), rename(config.runtimeFile)))
		.pipe(gulp.dest(config.path));
});
