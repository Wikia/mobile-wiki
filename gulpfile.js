'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	gutils = require('gulp-util'),
	nodemon = require('gulp-nodemon'),
	concat = require('gulp-concat'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	handlebars = require('gulp-ember-handlebars'),
	prefixer = require('gulp-autoprefixer'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	packages = require('./assets'),
	paths = {
		components: 'public/components/',
		mainScssFile: 'public/styles/app.scss',
		styles: 'public/styles/**/*.scss',
		front: 'public/scripts/**',
		back: 'server/**/*.ts',
		templates: 'public/templates/**/*.hbs',
		svg: 'public/svg/*.svg'
	};

function log() {
	var args = Array.prototype.slice.call(arguments, 0);

	return gutils.log.apply(null, [gutils.colors.cyan('[INFO]')].concat(args));
}

gulp.task('clean:dev', function () {
	return gulp.src('.tmp/', {
		read: false
	}).pipe(clean());
});

gulp.task('clean:prod', function () {
	return gulp.src('www', {
		read: false
	}).pipe(clean());
});

gulp.task('sass:dev', function () {
	var outDir = '.tmp/public/styles';

	return gulp
		.src(paths.mainScssFile)
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: 'map',
			errLogToConsole: true
		}))
		.pipe(prefixer(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true, map: false }))
		.pipe(gulp.dest(outDir));
});

gulp.task('scripts:front:dev', function () {
	var outDir = '.tmp/public/scripts';

	return gulp
		.src('public/scripts/**/*.ts')
		.pipe(typescript({
			target: 'ES5', //ES3
			sourcemap: false,
			outDir: outDir,
			out: 'main.js',
			//mapRoot: '',
			emitError: false,
			removeComments: true
		}))
		//.pipe(uglify())
		.pipe(gulp.dest(outDir));
});

gulp.task('scripts:back:dev', function () {
	var outDir = '.tmp';

	return gulp
		.src('server/**/*.ts')
		.pipe(typescript({
			module: 'commonjs', //amd
			target: 'ES5', //ES3
			emitError: false,
			outDir: outDir,
			removeComments: true
		}))
		.pipe(gulp.dest(outDir));
});

gulp.task('templates:dev', function () {
	return gulp.src(paths.templates)
		.pipe(handlebars({
			output: 'browser'
		}))
		.pipe(concat('templates.js'))
		.pipe(uglify())
		.pipe(gulp.dest('.tmp/public/scripts'));
});

gulp.task('components:dev', function () {
	var files = packages.map(function(asset){
		return paths.components + asset;
	});

	return gulp.src(files)
		.pipe(concat('assets.js'))
		.pipe(uglify())
		.pipe(gulp.dest('.tmp/public/components'));
});

gulp.task('sprites:dev', function () {
	return gulp.src(paths.svg)
		.pipe(svgmin())
		.pipe(sprites.svg({
			defs: true
		}))
		.pipe(gulp.dest('.tmp/public/svg'));
});

gulp.task('watch', function () {
	log('Watching files');

	gulp.watch(paths.styles, ['sass:dev']).on('change', function (event) {
		log('Style changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.front, ['scripts:front:dev']).on('change', function (event) {
		log('Script changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.back, ['scripts:back:dev']).on('change', function (event) {
		log('Script for backend changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.templates, ['templates:dev']).on('change', function (event) {
		log('Template changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.svg, ['sprites:dev']).on('change', function (event) {
		log('Svg changed:', gutils.colors.green(event.path));
	});
});

gulp.task('server:dev', ['scripts:back:dev'], function () {
	nodemon({
		script: '.tmp/server/app.js',
		ext: 'js',
		watch: [
			'.tmp/server'
		]
	});
});

gulp.task('assets:dev', [
		'sass:dev',
		'scripts:back:dev',
		'scripts:front:dev',
		'components:dev',
		'templates:dev',
		'sprites:dev'
]);
gulp.task('default', ['assets:dev', 'watch', 'server:dev']);
// gulp.task('production', ['clean:prod']);
