var gulp = require('gulp'),
	environment = require('../util/environment'),
	rev = require('gulp-rev'),
	changed = require('gulp-changed'),
	paths = require('../paths');

gulp.task('rev', ['sass', 'scripts:front', 'templates', 'components'], function () {
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
