var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	minifyHTML = require('gulp-minify-html'),
	preprocess = require('gulp-preprocess'),
	useref = require('gulp-useref'),
	rev = require('gulp-rev'),
	uglify = require('gulp-uglify'),
	revReplace = require('gulp-rev-replace'),
	replace = require('gulp-replace'),
	piper = require('../utils/piper'),
	paths = require('../paths'),
	options = require('../options'),
	environment = require('../utils/environment'),

	preprocessContext = {
		base: paths.baseFull
	},
	assets = useref.assets({
		searchPath: paths.base
	}),
	sync = !environment.isProduction && !gutil.env.nosync;

if (sync) {
	preprocessContext.browserSync = true;
}

gulp.task('build-views', ['scripts-front', 'vendor'], function () {
	return piper(
		gulp.src(paths.views.src, {
			base: paths.baseFull + '/server'
		}),
		gulpif('**/layout.hbs', preprocess({
			context: preprocessContext
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
			// Used to prefix assets in with CDN prefix
			gulpif(options.replace.selector, replace(options.replace.find, options.replace.replace)),
			minifyHTML({
				quotes: true
			})
		)),
		gulpif('**/views/**', gulp.dest(paths.views.dest))
	);
});
