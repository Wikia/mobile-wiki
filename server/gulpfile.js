/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0, no-throw-literal: 0 */

var fs = require('fs'),
	gulp = require('gulp'),
	babel = require('gulp-babel'),
	newer = require('gulp-newer'),
	plumber = require('gulp-plumber'),
	watch = require('gulp-watch'),
	path = require('path'),
	spawn = require('child_process').spawn,
	nodeDeps = Object.keys(require('./npm-shrinkwrap.json').dependencies),
	exitOnError = require('../gulp/utils/exit-on-error'),
	paths = require('../gulp/paths').server,
	pathsConfig = paths.config;

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
	gulp.src(paths.scripts.src, {base: './'})
		.pipe(newer({dest: paths.scripts.dest, ext: '.js'}))
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', exitOnError)
		.pipe(gulp.dest(paths.scripts.dest))
		.on('end', done);
});

/*
 * Compile server scripts for acceptance tests (with rewire plugin enabled)
 */
gulp.task('build-server-scripts-for-acceptance-tests', function (done) {
	gulp.src(paths.scripts.src, {base: './'})
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['rewire']
		}))
		.on('error', exitOnError)
		.pipe(gulp.dest(paths.scripts.dest))
		.on('end', done);
});

/*
 * Copy node dependencies to www/server/
 */
gulp.task('build-server-node-modules', function () {
	var deps = '/{' + nodeDeps.join('/**/*,') + '/**/*}';

	return gulp.src(paths.nodeModules.src + deps)
		.pipe(gulp.dest(paths.nodeModules.dest));
});

/*
 * Copy Ember's output index.html to www/server/app/views/ so it can be used as a template by Hapi
 */
gulp.task('build-server-views-main', function () {
	return gulp.src(paths.views.main.src, {base: paths.views.main.base})
		.pipe(plumber())
		.pipe(gulp.dest(paths.views.main.dest));
});

/*
 * Copy views from front/auth/views/ to www/server/app/views/
 */
gulp.task('build-server-views-auth', function () {
	return gulp.src(paths.views.auth.src)
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

/*
 * Watch files that the server build depends on
 */
gulp.task('watch-server', function () {
	watch(paths.views.main.src, function () {
		gulp.start('build-server-views-main');
	}).on('error', exitOnError);

	watch(paths.views.auth.src, function () {
		gulp.start('build-server-views-auth');
	}).on('error', exitOnError);

	watch(paths.views.src, function () {
		gulp.start('build-server-views');
	}).on('error', exitOnError);

	watch(paths.scripts.src, function () {
		gulp.start('build-server-scripts');
	}).on('error', exitOnError);
});

gulp.task('test-server', function () {
	var child = spawn('node', [path.resolve(__dirname, 'tests/node-qunit.runner.js')], {
		stdio: 'inherit'
	});

	child.on('exit', function (exitCode) {
		if (exitCode) {
			throw new Error('Tests failed');
		}
	});
});
