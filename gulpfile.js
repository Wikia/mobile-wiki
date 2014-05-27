'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	gutils = require('gulp-util'),
	nodemon = require('gulp-nodemon'),
	concat = require('gulp-concat'),
	changed = require('gulp-changed'),
	typescript = require('gulp-tsc'),
	uglify = require('gulp-uglify'),
	handlebars = require('gulp-ember-handlebars'),
	prefixer = require('gulp-autoprefixer'),
	svgmin = require('gulp-svgmin'),
	sprites = require('gulp-svg-sprites'),
	assets = require('./assets'),
	paths = {
		components: {
			in: 'public/components/',
			out: '.tmp/public/components'
		},
		styles: {
			aboveTheFold: 'public/styles/aboveTheFold.scss'
			watch: 'public/styles/**/*.scss',
			main: 'public/styles/app.scss',
			out: '.tmp/public/styles'
		},
		scripts: {
			front: {
				in: 'public/scripts/**/*.ts',
				out: '.tmp/public/scripts'
			},
			back: {
				in: 'server/**/*.ts',
				out: '.tmp'
			}
		},
		templates: {
			in: 'public/templates/**/*.hbs',
			out: '.tmp/public/scripts'
		},
		svg: {
			in: 'public/svg/*.svg',
			out: '.tmp/public/svg'
		}
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
	return gulp
		.src([paths.styles.main, paths.styles.aboveTheFold])
		.pipe(changed(paths.styles.out, { extension: '.css' }))
		.pipe(sass({
			outputStyle: 'compressed', //'nested'
			sourceComments: 'map',
			errLogToConsole: true
		}))
		.pipe(prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], { cascade: false, map: false }))//currently support for map is broken
		.pipe(gulp.dest(paths.styles.out));
});


gulp.task('scripts:front:dev', function () {
	return gulp
		.src(paths.scripts.front.in)
		.pipe(typescript({
			target: 'ES5', //ES3
			sourcemap: true,
			outDir: outDir,
			out: 'main.js',
			//mapRoot: '',
			emitError: false,
			removeComments: true
		}))
		//.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.front.out));
});

gulp.task('scripts:back:dev', function () {
	return gulp
		.src(paths.scripts.back.in)
		.pipe(typescript({
			module: 'commonjs', //amd
			target: 'ES5', //ES3
			emitError: false,
			outDir: outDir,
			removeComments: true
		}))
		.pipe(gulp.dest(paths.scripts.back.out));
});

gulp.task('templates:dev', function () {
	return gulp.src(paths.templates.in)
		.pipe(handlebars({
			output: 'browser'
		}))
		.pipe(concat('templates.js'))
		//.pipe(uglify())
		.pipe(gulp.dest(paths.templates.out));

});

gulp.task('components:dev', function () {
	Object.keys(assets).forEach(function(key){
		var files = assets[key].map(function(asset){
			return paths.components.in + asset;
		});

		gulp.src(files)
			.pipe(changed(outDir, { extension: '.js' }))
			.pipe(concat(key + '.js'))
			.pipe(uglify())
			.pipe(gulp.dest(paths.components.out));
	});
});

gulp.task('sprites:dev', function () {
	return gulp.src(paths.svg.in)
		.pipe(svgmin())
		.pipe(sprites.svg({
			defs: true
		}))
		.pipe(gulp.dest(paths.svg.out));
});

gulp.task('watch', function () {
	log('Watching files');

	gulp.watch(paths.styles, ['sass:dev']).on('change', function (event) {
		log('Style changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.scripts.front, ['scripts:front:dev']).on('change', function (event) {
		log('Script changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.scripts.back, ['scripts:back:dev']).on('change', function (event) {
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
