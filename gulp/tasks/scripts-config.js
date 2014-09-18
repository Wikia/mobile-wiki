var fs = require('fs'),
	gulp = require('gulp'),
	config = require('../paths').config,
	environment = require('../utils/environment').name;

gulp.task('scripts-config', function () {
	var configFileName = config.exampleFile;
	if (environment === 'testing') {
		configFileName = config.testFile;
	}
	configFileName = config.path + configFileName;
	if (!fs.existsSync(configFileName)) {
		return fs.createReadStream(configFileName)
			.pipe(fs.createWriteStream(config.path + config.runtimeFile));
	}
	return true;
});
