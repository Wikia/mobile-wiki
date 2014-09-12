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

	server.listen( {
		path: paths.nodemon.script,
		env: {
			WORKER_COUNT: 2,
			MAX_REQUEST_PER_CHILD: 1000
		},
		killSignal: 'SIGKILL',
		successMessage: /Server started/
	} );

	if (!gutil.env.nosync) {
		browserSync({
			ghostMode: {
				clicks: false,
				location: true,
				forms: false,
				scroll: false
			},
			debugInfo: false,
			reloadDelay: 50,
			open: false
		});
	}

	gulp.watch(paths.styles.watch, ['sass'], function (event) {
		log('Style changed:', gutil.colors.green(event.path));
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
		), ['tslint', 'scripts-front'], function (event) {
			log('Script changed:', gutil.colors.green(event.path));

			if (event.path.match('baseline')) {
				gulp.start('build');
			}
		});

	gulp.watch(paths.scripts.back.src, ['tslint', 'scripts-back'], function (event) {
		log('Script for backend changed:', gutil.colors.green(event.path));
	});

	gulp.watch(path.join(
			paths.templates.src,
			paths.templates.files
		), ['templates'], function (event) {
		log('Template changed:', gutil.colors.green(event.path));
	});

	gulp.watch(path.join(
			paths.svg.src,
			paths.svg.files
		), ['build'], function (event) {
		log('Svg changed:', gutil.colors.green(event.path));
	});

	gulp.watch(paths.views.src, ['build'], function (event) {
		log('Views changed:', gutil.colors.green(event.path));
	});

	gulp.watch(['www/config/*', 'www/public/**/*', 'www/server/**/*', 'www/views/**/*'], function (event) {
		log('Something changed:', gutil.colors.green(event.path));

		if (event.path.indexOf('/server/') !== -1) {
			console.log('server!');

			server.changed(reload);
		} else {
			reload(event.path);
		}


	});
});
