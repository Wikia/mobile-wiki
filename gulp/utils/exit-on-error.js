var gutil = require('gulp-util'),
	environment = require('../../gulp/utils/environment');

module.exports = function (error) {
	console.error('Build error: ' + error.message);

	if (gutil.env.testing && environment.isProduction) {
		process.exit(1);
	} else {
		this.emit('end');
	}
};
