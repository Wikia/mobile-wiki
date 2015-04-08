var gulp = require('gulp'),
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
		// This is not at the top because Mercury-Server Jenkins' job doesn't run bower (file doesn't exist)
		var compiler = require('../../front/vendor/ember/ember-template-compiler');

		if (file.isBuffer()) {
			file.contents = new Buffer(
				compiler.precompile(file.contents.toString(), false)
			);

			this.push(file);
		} else {
			throw new Error('Failed to compile: ' + file.path + ' template. Please pass a buffer to the compiler');
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
