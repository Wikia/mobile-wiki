var gutil = require('gulp-util'),
	environment = gutil.env.type || process.env.WIKIA_ENVIRONMENT || 'dev';

process.env.WIKIA_ENVIRONMENT = environment;

module.exports = {
	name: environment,
	isProduction: environment === 'production'
};
