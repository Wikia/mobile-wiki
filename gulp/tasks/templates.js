var gulp = require('gulp'),
	handlebars = require('gulp-handlebars'),
	emberHandlebars = require('ember-handlebars'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	wrap = require('gulp-wrap'),
	declare = require('gulp-declare'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	piper = require('../utils/piper'),
	environment = require('../utils/environment'),
	paths = require('../paths').templates,
	path = require('path');

gulp.task('templates', folders(paths.src, function (folder) {
	return piper(
		gulp.src(path.join(paths.src, folder, paths.files)),
		handlebars({
			handlebars: emberHandlebars
		}),
		wrap('Em.Handlebars.template(<%= contents %>)'),
		declare({
			root: 'Em.TEMPLATES',
			noRedeclare: true,
			processName: function(filePath) {
				return path.relative(path.join(paths.src, folder), filePath).replace('.js', '');
			}
		}),
		concat(folder + '.js'),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.dest)
	);
}));
