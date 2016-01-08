var concat = require('gulp-concat'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	prefixer = require('gulp-autoprefixer'),
	preprocess = require('gulp-preprocess'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	replace = require('gulp-replace'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	useref = require('gulp-useref'),
	path = require('path'),
	paths = require('../../gulp/paths'),
	sassOptions = require('../../gulp/options').sass,
	compile = require('../../gulp/utils/compile-es6-modules'),
	environment = require('../../gulp/utils/environment'),
	piper = require('../../gulp/utils/piper'),
	Server = require('karma').Server;

gulp.task('test-auth', ['build-auth'], function (done) {
	new Server({
		configFile: __dirname + '/tests/karma.conf.js'
	}, done).start();
});

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
		gulp.src(paths.auth.views.src, {
			base: process.cwd()
		}),
		gulp.dest(paths.base)
	);
});

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

gulp.task('build-auth-views', [
	'build-auth-vendor',
	'build-auth-views-copy',
	'build-auth-styles'
], function () {
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

gulp.task('build-auth', [
	'build-auth-scripts',
	'build-auth-views'
]);
