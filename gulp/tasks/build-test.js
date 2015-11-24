var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('build-test', ['scripts-front'], function () {
	return gulp.src([
			path.join(paths.src, paths.jsFiles),
			// The rest is built in scripts-front task
			// FIXME uncomment when we know how to set Babel to generate proper module paths
			// FIXME with the code above it's "auth/main", with the code below it's "main"
			//path.join(paths.src, 'auth', paths.jsFiles),
			//path.join(paths.src, 'main', paths.jsFiles),
			//path.join(paths.src, 'mercury', paths.jsFiles),
		])
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-es2015-modules-amd'],
			moduleIds: true
		}))
		.pipe(concat('test-modules.js'))
		.pipe(gulp.dest(paths.dest));
});
