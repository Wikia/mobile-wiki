var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	pipe = require('multipipe'),
	assets = require('../assets'),
	environment = require('../util/environment'),
	paths = require('../paths').components;

gulp.task('components', function () {
	Object.keys(assets).forEach(function(key){
		var files = assets[key].map(function(asset){
			return paths.in + asset;
		});

		pipe(
			gulp.src(files),
			changed(paths.out, { extension: '.js' }),
			concat(key + '.js'),
			gulpif(environment.isProduction, uglify()),
			gulp.dest(paths.out)
		);
	});
});
