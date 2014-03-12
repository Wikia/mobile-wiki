'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	gutils = require('gulp-util'),
	nodemon = require('gulp-nodemon'),
	paths = {
		styles: 'public/styles/**'
	};

function log() {
	var args = Array.prototype.slice.call(arguments, 0);

	return gutils
		.log
		.apply(null, [gutils.colors.cyan('[INFO]')].concat(args));
}

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

gulp.task('watch', function () {
	log('Watching files');
	var styles = gulp.watch(paths.styles, ['sass:dev']);

	styles.on('change', function (event) {
		log('Style changed:', gutils.colors.green(event.path));
	});
});

gulp.task('server:dev', function(){
	nodemon({ script: 'server.js', ext: 'js' });
});

gulp.task('assets:dev', ['sass:dev']);
gulp.task('default', ['server:dev', 'clean:dev', 'assets:dev', 'watch']);
// gulp.task('production', ['clean:prod']);
