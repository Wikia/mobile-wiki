var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	minifyHTML = require('gulp-minify-html'),
	preprocess = require('gulp-preprocess'),
	useref = require('gulp-useref'),
	rev = require('gulp-rev'),
	uglify = require('gulp-uglify'),
	revReplace = require('gulp-rev-replace'),
	piper = require('../utils/piper'),
	paths = require('../paths'),
	environment = require('../utils/environment');

gulp.task('build', ['node-modules', 'sass', 'scripts-front', 'sprites', 'vendor', 'templates', 'locales'], function () {
	var assets = useref.assets({
		searchPath: paths.base
	});

	return piper(
		gulp.src(paths.views.src, {
			base: paths.baseFull
		}),
		gulpif('**/layout.hbs', preprocess({
			context: {
				base: paths.baseFull
			}
		})),
		gulpif(environment.isProduction, piper(
			assets,
			//before running build I can not know what files from vendor to minify
			gulpif('**/vendor/**', uglify()),
			rev(),
			gulp.dest(paths.base),
			assets.restore(),
			useref(),
			revReplace(),
			minifyHTML()
		)),
		gulpif('**/views/**', gulp.dest(paths.views.dest))
	);
});
