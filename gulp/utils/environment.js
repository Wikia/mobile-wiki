var gutil = require('gulp-util'),
	environment = gutil.env.type || process.env.WIKIA_ENVIRONMENT || 'dev';

environment = (environment === 'production' ) ? 'prod' : environment;

module.exports = {
	name: environment,
	isProduction: environment === 'prod'
};
