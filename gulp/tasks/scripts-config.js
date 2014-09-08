var fs = require('fs'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	config = require('../paths').config;

gulp.task('script-config', function () {
	return gulp.src(config.path + config.exampleFile)
		.pipe(gulpif(!fs.existsSync(config.path + config.runtimeFile), rename(config.runtimeFile)))
		.pipe(gulp.dest(config.path));
});
