/*
 * default
 * The default build task
 */

var gulp = require('gulp');

gulp.task('default', ['tslint', 'watch', 'server']);
