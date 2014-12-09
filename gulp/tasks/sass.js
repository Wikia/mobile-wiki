var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	flipcss = require('flipcss'),
	piper = require('../utils/piper'),
	path = require('path'),
	through = require('through2'),
	options = require('../options').sass,
	paths = require('../paths').styles;


function flip() {
	var warnings = true,
		flipPseudo = false,
		flipUrls = true,
		flipSelectors = true;

	// creating a stream through which each file will pass
	// returning the file stream
	return through.obj(function(file, enc, done) {
		if (file.isBuffer()) {
			var rtlFile = file.clone();

			rtlFile.path = path.join(rtlFile.base, rtlFile.relative.replace('.', '.rtl.'));
			rtlFile.contents = new Buffer(
				flipcss.flip(
					rtlFile.contents.toString(),
					warnings,
					flipPseudo,
					flipUrls,
					flipSelectors
				)
			);

			this.push(rtlCss)
		}

		this.push(file);

		return done();
	});
}

gulp.task('sass', function () {
	return piper(
		gulp.src(paths.src),
		sass(options),
		//currently support for map is broken
		prefixer(['last 2 version', '> 1%', 'ie 8', 'ie 7'], {
			cascade: false,
			map: false
		}),
		flip(),
		gulp.dest(paths.dest)
	);
});
