var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	minifyHTML = require('gulp-minify-html'),
	preprocess = require('gulp-preprocess'),
	useref = require('gulp-useref'),
	rev = require('gulp-rev'),
	uglify = require('gulp-uglify'),
	revReplace = require('gulp-rev-replace'),
	multipipe = require('multipipe'),
	paths = require('../paths'),
	environment = require('../utils/environment');

gulp.task('build', ['node-modules', 'sass', 'scripts-front', 'sprites', 'vendor', 'templates'], function () {
	return multipipe(
		gulp.src(paths.views.src, {
			base: paths.baseFull
		}),
		gulpif('**/layout.hbs', preprocess({
			context: {
				base: paths.baseFull
			}
		})),
		gulpif(environment.isProduction, multipipe(
			useref.assets({
				searchPath: paths.base
			}),
			//before running build I can not know what files from vendor to minify
			gulpif('**/vendor/**', uglify()),
			rev(),
			gulp.dest(paths.base),
			useref.restore(),
			useref(),
			revReplace(),
			minifyHTML()
		)),
		gulpif('**/views/**', gulp.dest(paths.views.dest))
	);
});
