var gulp = require('gulp'),
	gutil = require('gulp-util'),
	server = require('gulp-develop-server'),
	log = require('../utils/logger'),
	paths = require('../paths'),
	path = require('path'),
	batch = require('gulp-batch'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('watch', ['build'], function () {
	log('Watching files');

	if (!gutil.env.nosync) {
		browserSync({
			ghostMode: false,
			logLevel: 'silent',
			open: false
		});
	}

	gulp.watch(paths.styles.watch, ['sass']).on('change', function (event) {
		/*
		 * Baseline is a scss file that gets inlined, so the views must be recompiled
		 * when it is changed
		 */
		if (event.path.match('baseline.scss')) {
			gulp.start('build');
		}
	});

	gulp.watch(path.join(
		paths.scripts.front.src,
		paths.scripts.front.files
	), ['tslint', 'scripts-front']).on('change', function (event) {
		if (event.path.match('baseline')) {
			gulp.start('build');
		}
	});

	gulp.watch([paths.scripts.back.src, paths.config.path + '*.ts'], ['tslint', 'scripts-back']);

	gulp.watch(path.join(
		paths.templates.src,
		paths.templates.files
	), ['templates']).on('change', function (event) {
		log('Template changed:', gutil.colors.green(event.path));
	});

	gulp.watch([
		path.join(paths.symbols.src, paths.symbols.files),
		paths.views.src
	], ['build']);

	//Watch build folder
	gulp.watch([
		paths.base + '/config/localSettings.js',
		paths.base + '/server/**/*',
		paths.base + '/views/**/*'
		], batch(server.changed)).on('change', function (event) {
			log('File changed:', gutil.colors.green(event.path), 'Reloading server');
		});

	gulp.watch(paths.base + '/public/**/*', batch(reload)).on('change', function (event) {
		log('File changed:', gutil.colors.green(event.path), 'Reloading browser');
	});
});
