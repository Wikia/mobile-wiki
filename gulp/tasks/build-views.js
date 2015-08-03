/*
 * build-views
 * Processes views and revisions some files
 */

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

gulp.task('build-views', ['scripts-front', 'vendor', 'build-vendor', 'build-combined'], function () {
	// retrieve gulp-rev-replace manifest files that were created with build-combined and build-vendor
	var manifest = gulp.src(['www/front/vendor/rev-manifest.json', 'www/front/scripts/rev-manifest.json']);

	return piper(
		gulp.src(paths.views.src, {
			base: paths.baseFullServer
		}),

		// preprocess and revReplace don't like being fed through piper/multipipe
		gulpif('**/_layouts/*.hbs', preprocess({context: preprocessContext})),
		// Read JSON manifests written out by rev. Allows replacing file names that were reved prior to the current task
		gulpif('**/_layouts/*.hbs', revReplace({manifest: manifest})),


		// for layouts that aren't ember-main.hbs, use gulp-useref to parse 'build' blocks in hbs source
		// containing files to optimize.
		gulpif('**/_layouts/*.hbs', piper(
			assets,
			gulpif('**/*.js', gulpif(environment.isProduction, uglify())),
			rev(),
			gulp.dest(paths.base),
			assets.restore(),
			useref(),
			// replace file names for all assets that have been piped through rev
			revReplace()
		)),

		gulpif('**/_layouts/*.hbs', gulp.dest('www/server/views/_layouts')),

		// for ember-main.hbs, find the file paths in the template source and replace them for prod CDN
		gulpif(environment.isProduction, piper(
			gulpif(options.replace.selector, replace(options.replace.find, options.replace.replace)),
			minifyHTML({
				quotes: true
			})
		)),
		gulpif('**/views/**', gulp.dest(paths.views.dest))
	);
});
