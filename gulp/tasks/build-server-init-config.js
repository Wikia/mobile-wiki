var fs = require('fs'),
	gulp = require('gulp'),
	paths = require('../paths').config;

gulp.task('build-server-init-config', function () {
	if (!fs.existsSync(paths.src + paths.runtimeFile)) {
		return fs.createReadStream(paths.src + paths.exampleFile)
			.pipe(fs.createWriteStream(paths.src + paths.runtimeFile));
	}
	return true;
});
