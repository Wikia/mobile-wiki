var gulp = require('gulp'),
	rename = require('gulp-rename'),
	ts = require('gulp-typescript'),
	wrap = require('gulp-wrap'),
	source = './src/*.ts',
	destination = './dist';

gulp.task('compile', function () {
	return gulp.src(source)
		.pipe(ts()).js
		.pipe(gulp.dest(destination));
});

gulp.task('compileAMD', function () {
	return gulp.src(source)
		.pipe(wrap('export <%= contents %>'))
		.pipe(ts({module: 'amd'})).js
		.pipe(rename(function (path) {
			path.basename += '.amd';
		}))
		.pipe(gulp.dest(destination));
});

gulp.task('compileCommonJS', function () {
	return gulp.src(source)
		.pipe(wrap('export <%= contents %>'))
		.pipe(ts({module: 'commonjs'})).js
		.pipe(rename(function (path) {
			path.basename += '.cjs';
		}))
		.pipe(gulp.dest(destination));
});

gulp.task('default', ['compile', 'compileAMD', 'compileCommonJS']);
