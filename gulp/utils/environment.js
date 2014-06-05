var gutil = require('gulp-util'),
	environment = gutil.env.type || 'dev';

module.exports = {
	name: environment,
	isProduction: environment === 'production'
};
