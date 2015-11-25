/*
 * scripts-config
 * Config for compiling ts files
 */

var fs = require('fs'),
	gulp = require('gulp'),
	config = require('../paths').config;

gulp.task('scripts-config', function () {
	if (!fs.existsSync(config.path + config.runtimeFile)) {
		return fs.createReadStream(config.path + config.exampleFile)
			.pipe(fs.createWriteStream(config.path + config.runtimeFile));
	}
	return true;
});
