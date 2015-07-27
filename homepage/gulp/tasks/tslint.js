var gulp = require('gulp'),
    tslint = require('gulp-tslint'),
    paths = require('../paths'),
    options = require('../options').tslint;

gulp.task('tslint', function(){
    return gulp.src(paths.scripts.homepage.watch)
        .pipe(tslint())
        .pipe(tslint.report('verbose', options));
});
