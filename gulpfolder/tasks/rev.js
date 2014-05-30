var gulp = require('gulp'),
	environment = require('../util/environment'),
	rev = require('gulp-rev'),
	filter = require('gulp-filter'),
	paths = require('../paths');

gulp.task('rev', function () {
	return gulp
		.src([
				paths.scripts.front.out + '/*.js',
				paths.styles.out + '/*.css',
				paths.components.out + '/*.js',
				paths.templates.out + '/*.js'
			],
			{base: '.'}
		)
		.pipe(rev())
		.pipe(gulp.dest(paths.base + '/../'))
		.pipe(rev.manifest())
		.pipe(gulp.dest(paths.base + '/public'));
});
