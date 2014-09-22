var fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	config = require('../paths').config;

gulp.task('scripts-config', function () {
	var configFileName = gutil.env.testing ? config.testFile : config.exampleFile;
	if (!fs.existsSync(config.path + config.runtimeFile)) {
		return fs.createReadStream(config.path + configFileName)
			.pipe(fs.createWriteStream(config.path + config.runtimeFile));
	}
	return true;
});
