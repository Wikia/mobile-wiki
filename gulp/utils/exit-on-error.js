var gutil = require('gulp-util'),
	logger = require('../../gulp/utils/logger'),
	environment = require('../../gulp/utils/environment');

module.exports = function (error) {
	logger('Build error: ' + error.message);

	if (gutil.env.testing && environment.isProduction) {
		process.exit(1);
	} else {
		this.emit('end');
	}
};
