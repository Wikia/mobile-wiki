var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	options = require('../options').nodemon;

gulp.task('server', ['scripts-back', 'build'], function () {
	nodemon(options);
});
