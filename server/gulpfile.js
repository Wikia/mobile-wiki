var fs = require('fs'),
	gulp = require('gulp'),
	babel = require('gulp-babel'),
	newer = require('gulp-newer'),
	rename = require('gulp-rename'),
	expect = require('gulp-expect-file'),
	nodeDeps = Object.keys(require('./package.json').dependencies),
	environment = require('../gulp/utils/environment'),
	exitOnError = require('../gulp/utils/exit-on-error'),
	paths = require('../gulp/paths').server,
	pathsConfig = paths.config,
	pathsScripts = paths.scripts;

/*
 * If config doesn't exist, create it from example
 */
gulp.task('build-server-init-config', function () {
	if (!fs.existsSync(pathsConfig.src + pathsConfig.runtimeFile)) {
		return fs.createReadStream(pathsConfig.src + pathsConfig.exampleFile)
			.pipe(fs.createWriteStream(pathsConfig.src + pathsConfig.runtimeFile));
	}
	return true;
});

/*
 * Compile server scripts
 */
gulp.task('build-server-scripts', ['build-server-init-config'], function (done) {
	gulp.src([pathsScripts.src, pathsScripts.config], {base: './'})
		.pipe(newer({dest: pathsScripts.dest, ext: '.js'}))
		.pipe(babel({
			presets: ['es2015'],
		}))
		.on('error', exitOnError)
		.pipe(gulp.dest(pathsScripts.dest))
		.on('end', done);
});

/*
 * Copy node dependencies to dist/server/
 */
gulp.task('build-server-node-modules', function () {
	var deps = '/{' + nodeDeps.join('/**/*,') + '/**/*}';

	return gulp.src(paths.nodeModules.src + deps)
		.pipe(gulp.dest(paths.nodeModules.dest));
});

/*
 * Copy Ember's output index.html to dist/server/app/views/ so it can be used as a template by Hapi
 */
gulp.task('build-server-views-main', function () {
	return gulp.src(paths.views.main.src)
		.pipe(expect({
			errorOnFailure: true
		}, paths.views.main.src))
		.on('error', exitOnError)
		.pipe(rename(paths.views.main.outputFilename))
		.pipe(gulp.dest(paths.views.main.dest));
});

/*
 * Copy views from front/auth/views/ to dist/server/app/views/
 */
gulp.task('build-server-views-auth', function () {
	return gulp.src(paths.views.auth.src)
		.pipe(expect({
			errorOnFailure: true
		}, paths.views.auth.src))
		.on('error', exitOnError)
		.pipe(gulp.dest(paths.views.dest));
});

/*
 * Copy view files
 */
gulp.task('build-server-views', [
	'build-server-views-main',
	'build-server-views-auth'
], function () {
	return gulp.src(paths.views.src)
		.pipe(gulp.dest(paths.views.dest));
});

gulp.task('build-server', [
	'build-server-node-modules',
	'build-server-scripts',
	'build-server-views'
]);
