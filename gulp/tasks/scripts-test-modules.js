var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-test-modules', function () {
	return gulp.src([
			path.join(paths.src, 'auth', paths.jsFiles),
			path.join(paths.src, 'main', paths.jsFiles),
			path.join(paths.src, 'mercury', paths.jsFiles),
		], {base: './front/scripts/'})
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-es2015-modules-amd'],
			moduleIds: true
		}))
		.pipe(concat('modules-test.js'))
		.pipe(gulp.dest(paths.dest));
});
