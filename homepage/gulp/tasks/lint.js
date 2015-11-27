/*
 * lint
 * Runs jshint on the server code
 */

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('lint', function () {
    gulp.src(['./server/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});
