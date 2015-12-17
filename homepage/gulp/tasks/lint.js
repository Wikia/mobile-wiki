/*
 * lint
 * Runs jshint on the applicable code
 */

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('lint', function () {
    gulp.src(['./gulp/*.js', './gulp/**/*.js', './server/**/*.js', './test/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});
