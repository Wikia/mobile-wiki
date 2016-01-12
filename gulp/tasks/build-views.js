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
	var manifest = gulp.src([
		'www/front/vendor/rev-manifest.json',
		'www/front/scripts/rev-manifest.json',
		'www/front/svg/rev-manifest-common.json',
		'www/front/svg/rev-manifest-discussion.json',
		'www/front/svg/rev-manifest-main.json',
		'www/front/svg/rev-manifest-social.json'
	]);
	return piper(
		gulp.src(paths.views.src, {
			base: paths.baseFullServer
		}),

		// preprocess and revReplace don't like being fed through piper/multipipe
		gulpif('**/_layouts/*.hbs', preprocess({context: preprocessContext})),
		// Read JSON manifests written out by rev. Allows replacing file names that were reved prior to the current task
		gulpif('**/_layouts/*.hbs', revReplace({manifest: manifest})),


		// TODO: Leave this in for now to run the normal template based assets pipeline while we're using async scripts
		gulpif(environment.isProduction,
			gulpif('**/_layouts/*.hbs', piper(
				assets,
				//before running build I can not know what files from vendor to minify
				gulpif('**/*.js', uglify()),
				rev(),
				gulp.dest(paths.base),
				assets.restore(),
				useref(),
				revReplace()
			)
		)),

		gulpif('**/_layouts/*.hbs', gulp.dest('www/server/views/_layouts')),

		// for ember-main.hbs, find the file paths in the template source and replace them for prod CDN
		gulpif(environment.isProduction, piper(
			gulpif(options.replace.selector.layouts, replace(options.replace.find, options.replace.replace)),
			gulpif(options.replace.selector.partials, replace(options.replace.find, options.replace.replace)),
			minifyHTML({
				quotes: true
			})
		)),
		gulpif('**/views/**/*.hbs', gulp.dest(paths.views.dest))
	);
});
