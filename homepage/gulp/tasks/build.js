/*
 * build
 * Builds application by invoking required tasks
 */

var gulp = require('gulp');

gulp.task('build', ['build-combined', 'sass']);
