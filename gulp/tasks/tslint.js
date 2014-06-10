var gulp = require('gulp'),
	tslint = require('gulp-tslint'),
	paths = require('../paths'),
	options = require('../options').tslint;

gulp.task('tslint', function () {
	gulp.src([paths.scripts.front.src + paths.scripts.front.files , paths.scripts.back.src ])
		.pipe(tslint())
		.pipe(tslint.report('verbose', options));
});
