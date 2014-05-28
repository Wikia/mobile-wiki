var gulp = require('gulp'),
	assets = require('./assets'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	changed = require('gulp-changed'),
	environment = require('../util/environment'),
	paths = require('../paths').components;

gulp.task('components', function () {
	Object.keys(assets).forEach(function(key){
		var files = assets[key].map(function(asset){
			return paths.components.in + asset;
		});

		gulp.src(files)
			.pipe(changed(paths.out, { extension: '.js' }))
			.pipe(concat(key + '.js'))
			.pipe(gulpif(environment === 'prod', uglify()))
			.pipe(gulp.dest(paths.out));
	});
});
