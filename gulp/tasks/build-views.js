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
	assets = useref.assets({
		searchPath: paths.base
	}),
	preprocessContext = {
		base: paths.baseFull
	},
	sync = !environment.isProduction && !gutil.env.nosync;

if (sync) {
	preprocessContext.browserSync = true;
}

gulp.task('build-views', ['scripts-front', 'copy-ts-source', 'vendor', 'build-vendor', 'build-combined'], function () {
	var manifest = gulp.src(['www/front/vendor/rev-manifest.json', 'www/front/scripts/rev-manifest.json']);
	return piper(
		gulp.src(paths.views.src, {
			base: paths.baseFullServer
		}),

		// These plugins don't like being fed through piper/multipipe
		gulpif('**/_layouts/**.hbs', preprocess({context: preprocessContext})),
		gulpif('**/_layouts/**.hbs', revReplace({manifest: manifest})),

		// TODO: Leave this in for now to run the normal template based assets pipeline for the duration
		// of the test
		gulpif('**/_layouts/*.hbs', piper(
			assets,
			//before running build I can not know what files from vendor to minify
			gulpif('**/*.js', uglify()),
			rev(),
			gulp.dest(paths.base),
			assets.restore(),
			useref(),
			revReplace()
		)),

		gulpif('**/_layouts/*.hbs', gulp.dest('www/server/views/_layouts')),
		gulpif(environment.isProduction, piper(
			// Used to prefix assets in with CDN prefix
			gulpif(options.replace.selector, replace(options.replace.find, options.replace.replace)),
			minifyHTML({
				quotes: true
			})
		)),
		gulpif('**/views/**', gulp.dest(paths.views.dest))
	);
});
