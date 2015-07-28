var gulp = require('gulp'),
	bower = require('gulp-bower');

gulp.task('bower', ['vendor'], function() {
	return bower()
		.pipe(gulp.dest('vendor'));
});
