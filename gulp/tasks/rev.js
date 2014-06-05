/**
 * Task to rev files based on gulp-rev
 * Adds md5 to a file name
 * and generates minifest of all the files that it changed
 */
var gulp = require('gulp'),
	rev = require('gulp-rev'),
	paths = require('../paths');

gulp.task('rev', ['sass', 'scripts-front', 'templates', 'components'], function () {
	return gulp
		.src([
				paths.scripts.front.dest + '/*.js',
				paths.styles.dest + '/*.css',
				paths.components.dest + '/*.js',
				paths.templates.dest + '/*.js'
			],
			{base: '.'}
		)
		.pipe(rev())
		.pipe(gulp.dest(paths.base + '/../'))
		.pipe(rev.manifest())
		.pipe(gulp.dest(paths.base + '/public'));
});
