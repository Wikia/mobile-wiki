var fs = require('fs'),
	gulp = require('gulp'),
	babel = require('gulp-babel'),
	gutil = require('gulp-util'),
	newer = require('gulp-newer'),
	rename = require('gulp-rename'),
	expect = require('gulp-expect-file'),
	nodeDeps = Object.keys(require('../package').dependencies),
	environment = require('../gulp/utils/environment'),
	paths = require('../gulp/paths').server,
	pathsConfig = paths.config,
	pathsScripts = paths.scripts;

/**
 * If config doesn't exist, create it from example
 */
gulp.task('build-server-init-config', function () {
	if (!fs.existsSync(pathsConfig.src + pathsConfig.runtimeFile)) {
		return fs.createReadStream(pathsConfig.src + pathsConfig.exampleFile)
			.pipe(fs.createWriteStream(pathsConfig.src + pathsConfig.runtimeFile));
	}
	return true;
});

/**
 * Compile server scripts
 */
gulp.task('build-server-scripts', ['build-server-init-config'], function (done) {
	gulp.src([pathsScripts.src, pathsScripts.config], {base: './'})
		.pipe(newer({dest: pathsScripts.dest, ext: '.js'}))
		.pipe(babel({
			presets: ['es2015'],
		}))
		.on('error', function (error) {
			if (gutil.env.testing && environment.isProduction) {
				console.error('Build contains some errors');
				process.exit(1);
			} else {
				console.error('Build error: ' + error.message);
				this.emit('end');
			}
		})
		.pipe(gulp.dest(pathsScripts.dest))
		.on('end', done);
});

/**
 * Copy node dependencies to dist/server/
 */
gulp.task('build-server-node-modules', function () {
	var deps = '/{' + nodeDeps.join('/**/*,') + '/**/*}';

	return gulp.src(paths.nodeModules.src + deps)
		.pipe(gulp.dest(paths.nodeModules.dest));
});

/**
 * Copy Ember's output index.html to dist/server/app/views so it can be used as a template by Hapi
 */
gulp.task('build-server-copy-main-index', function () {
	return gulp.src(paths.views.mainIndex.src)
		.pipe(expect(paths.views.mainIndex.src))
		.pipe(rename(paths.views.mainIndex.outputFilename))
		.pipe(gulp.dest(paths.views.mainIndex.dest));
});

/**
 * Copy view files
 */
gulp.task('build-server-views', ['build-server-copy-main-index'], function () {
	return gulp.src(paths.views.src)
		.pipe(gulp.dest(paths.views.dest));
});

gulp.task('build-server', [
	'build-server-node-modules',
	'build-server-scripts',
	'build-server-views'
]);
