'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	gutils = require('gulp-util'),
	nodemon = require('gulp-nodemon'),
	browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	es6ify = require('es6ify'),
	handlebars = require('gulp-ember-handlebars'),
	prefixer = require('gulp-autoprefixer'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	paths;

paths = {
	components: 'public/components/**',
	styles: 'public/styles/**',
	scripts: 'public/scripts/**',
	templates: 'public/templates/**/*.hbs',
	svg: 'public/svg/*.svg'
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
			outputStyle: 'expanded',
			sourceComments: 'map',
			errLogToConsole: true
		}))
		.pipe(prefixer(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true, map: false }))
		.pipe(gulp.dest('.tmp/public/styles'));
});

es6ify.traceurOverrides = {
	// Has weird behavior with `this` keyword reference
	arrowFunctions: false
};

gulp.task('scripts:dev', function () {
	return gulp.src('./public/scripts/main.js')
			.pipe(browserify({
			transform: [es6ify],
			debug: true
		}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('.tmp/public/scripts'));
});

gulp.task('templates:dev', function () {
	gulp.src(paths.templates)
		.pipe(handlebars({
					output: 'browser'
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('.tmp/public/scripts'));
});

gulp.task('components:dev', function () {
	// TODO: Temporary copy over bower components to tmp folder till we figure out approach for bundling all assets
	gulp.src(paths.components + '/*.js')
		.pipe(gulp.dest('.tmp/public/components'));
});

gulp.task('sprites:dev', function () {
	gulp.src(paths.svg)
		.pipe(svgmin())
		.pipe(sprites.svg({
					defs: true
		}))
		.pipe(gulp.dest('.tmp/public/svg'));
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

	gulp.watch(paths.templates, ['templates:dev']).on('change', function (event) {
		log('Template changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.svg, ['sprites:dev']).on('change', function (event) {
		log('Svg changed:', gutils.colors.green(event.path));
	});
});

gulp.task('server:dev', function () {
	nodemon({
		script: 'server.js',
		ext: 'js'
	});
});

gulp.task('assets:dev', ['sass:dev', 'scripts:dev', 'components:dev', 'templates:dev', 'sprites:dev']);
gulp.task('default', ['assets:dev', 'watch', 'server:dev']);
// gulp.task('production', ['clean:prod']);
