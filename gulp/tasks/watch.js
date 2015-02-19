var gulp = require('gulp'),
	gutil = require('gulp-util'),
	server = require('gulp-develop-server'),
	log = require('../utils/logger'),
	paths = require('../paths'),
	path = require('path'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('watch', ['build', 'build-views'], function () {
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
			gulp.start('build-views');
		}
	});

	gulp.watch(path.join(
		paths.scripts.front.src,
		paths.scripts.front.files
	), ['tslint', 'scripts-front']).on('change', function (event) {
		if (event.path.match('baseline')) {
			gulp.start('build-views');
		}
	});

	gulp.watch([paths.scripts.server.src, paths.config.path + '*.ts'], ['tslint', 'scripts-server']);

	gulp.watch(path.join(
		paths.templates.src,
		paths.templates.files
	), ['templates']).on('change', function (event) {
		log('Template changed:', gutil.colors.green(event.path));
	});

	gulp.watch(paths.locales.src, ['locales']).on('change', function (event) {
		log('Locales changed:', gutil.colors.green(event.path));
	});

	gulp.watch([
		path.join(paths.symbols.src, paths.symbols.files),
		paths.views.src
	], ['build']);

	gulp.watch([
		paths.base + '/config/*',
		paths.base + '/server/**/*',
		paths.base + '/views/**/*',
		paths.base + '/front/scripts/*.js',
		paths.base + '/front/styles/*.css',
		paths.base + '/front/templates/*.js',
		paths.base + '/front/locales/**/translate.json'
	]).on('change', function (event) {
		log('File changed:', gutil.colors.green(event.path), 'Restarting server');

		server.restart(function () {
			if (event.path.match('front')) {
				reload(path);

				log('Updating browser');
			}
		});
	});
});
