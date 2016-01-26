/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0 */

var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	prefixer = require('gulp-autoprefixer'),
	preprocess = require('gulp-preprocess'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	useref = require('gulp-useref'),
	watch = require('gulp-watch'),
	path = require('path'),
	runSequence = require('run-sequence'),
	paths = require('../../gulp/paths'),
	sassOptions = require('../../gulp/options').sass,
	compile = require('../../gulp/utils/compile-es6-modules'),
	environment = require('../../gulp/utils/environment'),
	piper = require('../../gulp/utils/piper'),
	karmaServer = require('karma').Server;

gulp.task('build-auth-scripts', function (done) {
	var pathsScripts = paths.auth.scripts;

	compile(done, pathsScripts.src, pathsScripts.base, pathsScripts.dest, 'app.js', 'auth');
});

gulp.task('build-auth-vendor', function () {
	return piper(
		gulp.src(paths.auth.vendor.src),
		gulp.dest(paths.auth.vendor.dest)
	);
});

gulp.task('build-auth-styles', function () {
	var pathsStyles = paths.auth.styles;

	return piper(
		gulp.src([
			path.join(pathsStyles.src, pathsStyles.compile),
			'!' + path.join(pathsStyles.src, pathsStyles.partials)
		]),
		sass(sassOptions),
		prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
			cascade: false,
			map: false
		}),
		gulp.dest(pathsStyles.dest)
	);
});

gulp.task('build-auth-views-copy', function () {
	return piper(
		gulp.src([
			paths.auth.views.src,
			'!' + paths.auth.views.index
		], {
			base: process.cwd()
		}),
		gulp.dest(paths.base)
	);
});

/**
 * @returns {*}
 */
function concatenateAndMinifyAssets() {
	var userefAssets = useref.assets({
		searchPath: paths.base
	});

	return piper(
		// concatenate assets
		userefAssets,
		// rename concatenated files
		rev(),
		gulpif(paths.jsPattern, uglify()),
		userefAssets.restore(),
		useref(),
		// substitute new filenames
		revReplace({
			// additionaly use rev manifests created in previous tasks
			manifest: gulp.src(paths.common.revManifest)
		})
	);
}

gulp.task('build-auth-views-index', function () {
	return piper(
		gulp.src(paths.auth.views.index, {
			base: process.cwd()
		}),
		preprocess({
			includeBase: paths.baseFull
		}),
		gulpif(environment.isProduction, concatenateAndMinifyAssets()),
		gulp.dest(paths.base)
	);
});

gulp.task('build-auth', function (done) {
	runSequence(
		'build-auth-scripts',
		[
			'build-auth-vendor',
			'build-auth-views-copy',
			'build-auth-styles'
		],
		'build-auth-views-index',
		done
	);
});

gulp.task('watch-auth', function () {
	watch(paths.auth.scripts.src, function () {
		runSequence(
			'build-auth-scripts',
			'build-auth-views-index'
		);
	});

	watch(paths.auth.vendor.src, function () {
		runSequence(
			'build-auth-vendor',
			'build-auth-views-index'
		);
	});

	watch(paths.auth.styles.watch, function () {
		runSequence(
			'build-auth-styles',
			'build-auth-views-index'
		);
	});

	watch(paths.auth.views.src, function () {
		gulp.start('build-auth-views-copy');
	});

	watch(paths.auth.views.index, function () {
		gulp.start('build-auth-views-index');
	});
});

gulp.task('test-auth', function (done) {
	new karmaServer({
		configFile: __dirname + '/tests/karma.conf.js'
	}, done).start();
});
