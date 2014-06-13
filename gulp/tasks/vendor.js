var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	packages = require('../../bower').packages,
	environment = require('../utils/environment'),
	paths = require('../paths').vendor;

gulp.task('vendor', function (done) {
	var packageNames = Object.keys(packages),
		length = packageNames.length,
		i = 0;

	packageNames.forEach(function (name) {
		var files = packages[name].map(function (asset) {
			return paths.src + asset;
		});

		gulp.src(files)
			.pipe(changed(paths.dest, {
				extension: '.js'
			}))
			.pipe(concat(name + '.js'))
			.pipe(gulpif(environment.isProduction, uglify()))
			.pipe(gulp.dest(paths.dest));

		i += 1;

		if (i === length) {
			done();
		}
	});
});
