var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	options = require('../options').nodemon;

gulp.task('server', ['scripts-back', 'views'], function () {
	nodemon(options);
});
