var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	assets = require('../assets'),
	environment = require('../utils/environment'),
	paths = require('../paths').vendor;

gulp.task('vendor', function (done) {
	var packages = Object.keys(assets),
		length = packages.length,
		i = 0;

	packages.forEach(function (key) {
		var files = assets[key].map(function (asset) {
			return paths.src + asset;
		});

		gulp.src(files)
			.pipe(changed(paths.dest, {
				extension: '.js'
			}))
			.pipe(concat(key + '.js'))
			.pipe(gulpif(environment.isProduction, uglify()))
			.pipe(gulp.dest(paths.dest));

		i += 1;

		if (i === length) {
			done();
		}
	});
});
