/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0 */

var fs = require('fs'),
	gulp = require('gulp'),
	babel = require('gulp-babel'),
	changed = require('gulp-changed'),
	newer = require('gulp-newer'),
	rename = require('gulp-rename'),
	watch = require('gulp-watch'),
	path = require('path'),
	spawn = require('child_process').spawn,
	nodeDeps = Object.keys(require('./package.json').dependencies),
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
			presets: ['es2015'],
		}))
		.on('error', exitOnError)
		.pipe(gulp.dest(paths.scripts.dest))
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
		.pipe(rename(paths.views.main.outputFilename))
		// Ember rebuilds index.html on every change
		// Let's not restart server unless this file is actually modified
		.pipe(changed(paths.views.main.dest, {
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(gulp.dest(paths.views.main.dest));
});

/*
 * Copy views from front/auth/views/ to dist/server/app/views/
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
	var mainIndexPath = path.join(process.cwd(), paths.views.main.src);

	// Ember is built asynchronously (its first build finishes after this task is called)
	// Because of that the front/main/index.html doesn't exist yet and we have to watch whole dir instead of single file
	// There is no visible performance penalty
	watch(paths.views.main.watch, {
		read: false,
		// index.html is on level 2, there is no point of watching anything that's deeper
		depth: 2
	}).on('add', function (file) {
		if (file === mainIndexPath) {
			gulp.start('build-server-views-main');
		}
	});

	watch(paths.views.auth.src, function () {
		gulp.start('build-server-views-auth');
	});

	watch(paths.views.src, function () {
		gulp.start('build-server-views');
	});

	watch(paths.scripts.src, function () {
		gulp.start('build-server-scripts');
	});
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
