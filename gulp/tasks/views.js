var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	minifyHTML = require('gulp-minify-html'),
	preprocess = require('gulp-preprocess'),
	useref = require('gulp-useref'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	paths = require('../paths'),
	environment = require('../utils/environment');

gulp.task('views', ['assets'], function views() {
	return gulp.src(paths.views.src, {base: paths.baseFull})
		.pipe(gulpif('**/layout.hbs', preprocess({
			context: {
				base: paths.baseFull
			}
		})))
		.pipe(useref.assets({
			searchPath: paths.base
		}))
		.pipe(gulpif(environment.isProduction, rev()))
		.pipe(gulp.dest(paths.base))
		.pipe(useref.restore())
		.pipe(useref())
		.pipe(revReplace())
		.pipe(gulpif(environment.isProduction, minifyHTML()))
		.pipe(gulpif('**/views/*', gulp.dest(paths.views.dest)));
});
