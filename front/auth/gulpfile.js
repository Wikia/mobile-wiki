var gulp = require('gulp'),
	concat = require('gulp-concat'),
	paths = require('../../gulp/paths'),
	pathsScripts = paths.auth.scripts,
	compile = require('../../gulp/utils/compile-es6-modules'),
	environment = require('../../gulp/utils/environment');

gulp.task('build-auth-scripts', function (done) {
	compile(done, pathsScripts.src, pathsScripts.base, pathsScripts.dest, 'app.js', 'auth');
});

gulp.task('build-auth', ['build-auth-scripts']);
