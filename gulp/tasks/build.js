var gulp = require('gulp');

gulp.task('build', ['assets', 'rev', 'views:revved']);
