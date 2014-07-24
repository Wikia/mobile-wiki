var gulp = require('gulp'),
	fixtures2js = require("gulp-fixtures2js");

gulp.task('fixtures', function () {
	return gulp.src([
			'./test/fixtures/*.json',
			'./test/fixtures/**/*.json'
		])
		.pipe(fixtures2js('test-fixtures.js', {
			postProcessors: {
				"**/*.json": "json"
			}
		}))
		.pipe(gulp.dest('test/fixtures'));
});
