var gulp = require('gulp'),
	compiler = require('ember-template-compiler'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	wrap = require('gulp-wrap'),
	declare = require('gulp-declare'),
	gulpif = require('gulp-if'),
	folders = require('gulp-folders'),
	piper = require('../utils/piper'),
	environment = require('../utils/environment'),
	paths = require('../paths').templates,
	path = require('path'),
	through = require('through2');


function compile (options) {
	// creating a stream through which each file will pass
	// returning the file stream
	return through.obj(function(file, enc, done) {
		if (file.isBuffer()) {

			file.contents = new Buffer(
				compiler.precompile(file.contents.toString(), false)
			);

			this.push(file);
		} else {
			throw new Error('Flip: Only buffer is supported');
		}

		return done();
	});
}

gulp.task('templates', folders(paths.src, function (folder) {
	return piper(
		gulp.src(path.join(paths.src, folder, paths.files)),
		compile(),
		wrap('Em.Handlebars.template(<%= contents %>)'),
		declare({
			root: 'Em.TEMPLATES',
			noRedeclare: true,
			processName: function(filePath) {
				return path.relative(path.join(paths.src, folder), filePath).replace('.hbs', '');
			}
		}),
		concat(folder + '.js'),
		gulpif(environment.isProduction, uglify()),
		gulp.dest(paths.dest)
	);
}));
