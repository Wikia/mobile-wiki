var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	assets = require('../assets'),
	environment = require('../util/environment'),
	paths = require('../paths').components;

gulp.task('components', function (done) {
	var packages = Object.keys(assets),
		length = packages.length,
		i = 0;

	packages.forEach(function (key) {
		var files = assets[key].map(function (asset) {
			return paths.in + asset;
		});

		gulp.src(files)
			.pipe(changed(paths.out, {
				extension: '.js'
			}))
			.pipe(concat(key + '.js'))
			.pipe(gulpif(environment.isProduction, uglify()))
			.pipe(gulp.dest(paths.out));

		i += 1;

		if (i === length) {
			done();
		}
	});
});
