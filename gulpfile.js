'use strict';

var gulp = require('gulp'),
		clean = require('gulp-clean'),
		sass = require('gulp-sass'),
		gutils = require('gulp-util'),
		nodemon = require('gulp-nodemon'),
		browserify = require('gulp-browserify'),
		paths;

paths = {
	components: 'public/components/**',
	styles: 'public/styles/**',
	scripts: 'public/scripts/**.js'
};

function log() {
	var args = Array.prototype.slice.call(arguments, 0);

	return gutils.log.apply(null, [gutils.colors.cyan('[INFO]')].concat(args));
}

gulp.task('clean:dev', function () {
	return gulp.src('.tmp/public', {
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

gulp.task('scripts:dev', function () {
	gulp.src(paths.scripts)
		.pipe(browserify({
			debug: process.env.NODE_ENV !== 'production'
		}))
		.pipe(gulp.dest('.tmp/public/scripts'));
});

gulp.task('components:dev', function () {
	// TODO: Temporary copy over bower components to tmp folder till we figure out approach for bundling all assets
	gulp.src(paths.components + '/*.js')
		.pipe(gulp.dest('.tmp/public/components'));
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

gulp.task('server:dev', function () {
	nodemon({
		script: 'server.js',
		ext: 'js'
	});
});

gulp.task('assets:dev', ['sass:dev', 'scripts:dev', 'components:dev']);
gulp.task('default', ['assets:dev', 'watch', 'server:dev']);
// gulp.task('production', ['clean:prod']);
