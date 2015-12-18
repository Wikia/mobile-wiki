/*
 * build
 * Builds application by invoking required tasks
 */

var gulp = require('gulp');

gulp.task('build', ['build-combined', 'lint', 'eslint', 'sass']);
