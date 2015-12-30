var gulp = require('gulp'),
	paths = require('../../gulp/paths'),
	pathsScripts = paths.common.scripts,
	pathsPublic = paths.common.public;

function buildCommonScripts(done, src, filename, moduleRoot) {
	var babel = require('gulp-babel'),
		concat = require('gulp-concat'),
		gulpif = require('gulp-if'),
		newer = require('gulp-newer'),
		uglify = require('gulp-uglify'),
		gutil = require('gulp-util'),
		environment = require('../../gulp/utils/environment'),
		babelOptions = {
			presets: ['es2015']
		};

	if (moduleRoot) {
		babelOptions.plugins = ['transform-es2015-modules-amd'];
		babelOptions.moduleIds = true;
		babelOptions.moduleRoot = moduleRoot;
	}

	gulp.src(src, {
			base: './front/common/'
		})
		.pipe(newer(pathsScripts.dest.main))
		.pipe(babel(babelOptions))
		.on('error', function (error) {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some errors');
				process.exit(1);
			} else {
				console.error('Build error: ' + error.message);
				this.emit('end');
			}
		})
		.pipe(concat(filename))
		.pipe(gulpif(environment.isProduction, uglify()))
		.pipe(gulp.dest(pathsScripts.dest.main))
		.on('end', done);
}

gulp.task('build-common-scripts-baseline', function (done) {
	buildCommonScripts(done, pathsScripts.base + '/baseline/**/*.js', 'baseline.js');
});

gulp.task('build-common-scripts-modules-utils', function (done) {
	buildCommonScripts(done, [
		pathsScripts.base + '/modules/**/*.js',
		pathsScripts.base + '/utils/**/*.js',
	], 'common.js', 'common');
});

/*
 * Compile and concatenate common scripts
 */
gulp.task('build-common-scripts', [
	'build-common-scripts-baseline',
	'build-common-scripts-modules-utils'
]);

/*
 * Copy all files from /front/common/public/ to /dist/front/common/
 */
gulp.task('build-common-public', function () {
	return gulp.src(pathsPublic.src)
		.pipe(gulp.dest(pathsPublic.dest));
});

gulp.task('build-common', [
	'build-common-scripts',
	'build-common-public'
]);
