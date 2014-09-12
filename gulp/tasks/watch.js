var gulp = require('gulp'),
	gutil = require('gulp-util'),
	server = require('gulp-develop-server'),
	log = require('../utils/logger'),
	paths = require('../paths'),
	path = require('path'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('watch', ['build'], function () {
	log('Watching files');

	if (!gutil.env.nosync) {
		browserSync({
			ghostMode: {
				clicks: false,
				location: true,
				forms: false,
				scroll: false
			},
			debugInfo: false,
			reloadDelay: 100,
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

	gulp.watch(paths.scripts.back.src, ['tslint', 'scripts-back']);

	gulp.watch(path.join(
		paths.templates.src,
		paths.templates.files
	), ['templates']).on('change', function (event) {
		log('Template changed:', gutil.colors.green(event.path));
	});

	gulp.watch([
		path.join(paths.svg.src, paths.svg.files),
		paths.views.src
	], ['build']);

	gulp.watch(['www/config/*', 'www/public/**/*', 'www/server/**/*', 'www/views/**/*']).on('change', function (event) {
		log('File changed:', gutil.colors.green(event.path));

		if (event.path.indexOf('/server/') !== -1) {
			server.changed(reload);
		} else {
			reload(event.path);
		}
	});
});
