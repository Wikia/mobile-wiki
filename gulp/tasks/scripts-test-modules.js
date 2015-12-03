var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	paths = require('../paths').scripts.front,
	path = require('path');

gulp.task('scripts-test-modules', function (done) {
	gulp.src([
			path.join(paths.src, 'auth', paths.jsFiles),
			path.join(paths.src, 'main', paths.jsFiles),
			path.join(paths.src, 'mercury', paths.jsFiles),
		], {base: './front/scripts/'})
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-es2015-modules-amd'],
			moduleIds: true
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
		.pipe(concat('modules-test.js'))
		.pipe(gulp.dest(paths.dest))
		.on('end', done);
});
