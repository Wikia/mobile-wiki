var gulp = require('gulp'),
	filter = require('gulp-filter'),
	htmlreplace = require('gulp-html-replace'),
	minifyHTML = require('gulp-minify-html');
	rev = require('gulp-rev'),
	fileinclude = require('gulp-file-include');
	paths = require('../paths');

gulp.task('views', ['sass', 'scripts:front', 'components', 'templates', 'sprites'],function() {
	var css = require('../../' + paths.styles.out + '/rev-manifest.json'),
		scripts = require('../../' + paths.scripts.front.out + '/rev-manifest.json'),
		templates = require('../../' + paths.templates.out + '/rev-manifest.json'),
		components = require('../../' + paths.components.out + '/rev-manifest.json');

	return gulp.src(paths.views.in)
		.pipe(htmlreplace({
			css: '../public/styles/' + css['app.css'],
			components: '../public/components/' + components['main.js'],
			templates: '../public/templates/' + templates['main.js'],
			scripts: '../public/scripts/' + scripts['main.js']
		}))
		.pipe(fileinclude({
			basepath: paths.baseFull
		}))
		.pipe(minifyHTML({

		}))
		.pipe(gulp.dest(paths.views.out));
});
