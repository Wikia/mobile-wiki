'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var gutils = require('gulp-util');
var browserify = require('gulp-browserify');

function log() {
	var args = Array.prototype.slice.call(arguments, 0);
	return gutils
		.log
		.apply(null, [gutils.colors.cyan('[INFO]')].concat(args));
}

var paths = {
	styles: 'public/styles/**',
	scripts: 'public/scripts/**',
	main: 'public/scripts/test.js'
};

gulp.task('clean:dev', function () {
	return gulp.src('.tmp/public/**', {
		read: false
	}).pipe(clean());
});

gulp.task('clean:prod', function () {
	return gulp.src('www', {
		read: false
	}).pipe(clean());
});

gulp.task('sass:dev', function () {
	return gulp.src(paths.styles)
		.pipe(sass({
			includePaths: ['./public/styles'],
			outputStyle: 'expanded',
			sourceComments: 'map'
		}))
		.pipe(gulp.dest('.tmp/public/styles'));
});

gulp.task('scripts:dev', function() {
	gulp.src(paths.main)
		.pipe(browserify({
			debug: process.env.NODE_ENV !== 'production'
		}))
		.pipe(gulp.dest('.tmp/public/js'));
});

gulp.task('watch', function () {
	log('Watching files');
	var styles = gulp.watch(paths.styles, ['sass:dev']);
	styles.on('change', function (event) {
		log('Style changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.scripts, ['scripts:dev']).on('change', function (event) {
		log('Script changed:', gutils.colors.green(event.path));
	});
});

gulp.task('assets:dev', ['sass:dev', 'scripts:dev']);
gulp.task('default', ['clean:dev', 'assets:dev', 'watch']);
// gulp.task('production', ['clean:prod']);
