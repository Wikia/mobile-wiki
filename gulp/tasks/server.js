var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	options = require('../options').nodemon;

gulp.task('server', ['scripts-back', 'node-modules', 'build'], function () {
	nodemon(options);
});
