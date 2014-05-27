'use strict';

var gulp = require('gulp'),
	argv = require('minimist')(process.argv.slice(2)),
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
	availableEnvironments = ['dev', 'prod'],
	environment = (function(type){
		type = type || 'dev';

		if (availableEnvironments.indexOf(type) === -1) {
			log('Not recognized type: ', type);
			log('Available environments: ', availableEnvironments);
			process.exit();
		}

		return type;
	})(argv.type),
	basePaths = {
		dev: '.tmp',
		prod: 'www'
	},
	basePath = basePaths[environment],
	paths = {
		components: {
			in: 'public/components/',
			out: basePath + '/public/components'
		},
		styles: {
			aboveTheFold: 'public/styles/aboveTheFold.scss',
			watch: 'public/styles/**/*.scss',
			main: 'public/styles/app.scss',
			out: basePath + '/public/styles'
		},
		scripts: {
			front: {
				in: 'public/scripts/**/*.ts',
				out: basePath + '/public/scripts'
			},
			back: {
				in: 'server/**/*.ts',
				out: basePath
			}
		},
		templates: {
			in: 'public/templates/**/*.hbs',
			out: basePath + '/public/scripts'
		},
		svg: {
			in: 'public/svg/*.svg',
			out: basePath + '/public/svg'
		}
	},
	options = {
		sass: {
			dev: {
				outputStyle: 'nested',
				sourceComments: 'map',
				errLogToConsole: true
			},
			prod: {
				outputStyle: 'compressed',
				errLogToConsole: false
			}
		},
		scripts: {
			front: {
				dev: {
					target: 'ES5',
					sourcemap: true,
					outDir: paths.scripts.front.out,
					out: 'main.js',
					//mapRoot: '',
					emitError: false,
					removeComments: false
				},
				prod: {
					target: 'ES5',
					sourcemap: false,
					outDir: paths.scripts.front.out,
					out: 'main.js',
					//mapRoot: '',
					emitError: false,
					removeComments: true
				}
			},
			back: {
				dev: {
					module: 'commonjs',
					target: 'ES5',
					emitError: false,
					outDir: paths.scripts.back.out,
					removeComments: true
				},
				prod: {
					module: 'commonjs',
					target: 'ES5',
					emitError: false,
					outDir: paths.scripts.back.out,
					removeComments: true
				}
			}
		},
		handlebars: {
			dev: {
				output: 'browser'
			},
			prod: {
				output: 'browser'
			}
		},
		svg: {
			dev: {
				defs: true
			},
			prod: {
				defs: true
			}
		}
	};


function log() {
	var args = Array.prototype.slice.call(arguments, 0);

	return gutils.log.apply(null, [gutils.colors.cyan('[INFO]')].concat(args));
}

gulp.task('clean', function () {
	return gulp.src(basePath, {
		read: false
	}).pipe(clean());
});

gulp.task('sass', function () {
	return gulp
		.src([paths.styles.main, paths.styles.aboveTheFold])
		.pipe(changed(paths.styles.out, { extension: '.css' }))
		.pipe(sass(options.sass[environment]))
		.pipe(prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], { cascade: false, map: false }))//currently support for map is broken
		.pipe(gulp.dest(paths.styles.out));
});


gulp.task('scripts:front', function () {
	return gulp
		.src(paths.scripts.front.in)
		.pipe(typescript(options.scripts.front[environment]))
		//.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.front.out));
});

gulp.task('scripts:back', function () {
	return gulp
		.src(paths.scripts.back.in)
		.pipe(typescript(options.scripts.back[environment]))
		.pipe(gulp.dest(paths.scripts.back.out));
});

gulp.task('templates', function () {
	return gulp.src(paths.templates.in)
		.pipe(handlebars(options.handlebars[environment]))
		.pipe(concat('templates.js'))
		//.pipe(uglify())
		.pipe(gulp.dest(paths.templates.out));

});

gulp.task('components', function () {
	Object.keys(assets).forEach(function(key){
		var files = assets[key].map(function(asset){
			return paths.components.in + asset;
		});

		gulp.src(files)
			.pipe(changed(paths.components.out, { extension: '.js' }))
			.pipe(concat(key + '.js'))
			.pipe(uglify())
			.pipe(gulp.dest(paths.components.out));
	});
});

gulp.task('sprites', function () {
	return gulp.src(paths.svg.in)
		.pipe(svgmin())
		.pipe(sprites.svg(options.svg[environment]))
		.pipe(gulp.dest(paths.svg.out));
});

gulp.task('watch', function () {
	log('Watching files');

	gulp.watch(paths.styles.in, ['sass']).on('change', function (event) {
		log('Style changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.scripts.front.in, ['scripts:front']).on('change', function (event) {
		log('Script changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.scripts.back.in, ['scripts:back']).on('change', function (event) {
		log('Script for backend changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.templates.in, ['templates']).on('change', function (event) {
		log('Template changed:', gutils.colors.green(event.path));
	});

	gulp.watch(paths.svg.in, ['sprites']).on('change', function (event) {
		log('Svg changed:', gutils.colors.green(event.path));
	});
});

gulp.task('server', ['scripts:back'], function () {
	nodemon({
		script: '.tmp/server/app.js',
		ext: 'js',
		watch: [
			'.tmp/server'
		]
	});
});

gulp.task('assets', [
		'sass',
		'scripts:back',
		'scripts:front',
		'components',
		'templates',
		'sprites'
]);

gulp.task('default', ['assets', 'watch', 'server']);
gulp.task('build', ['clean', 'assets']);
