/**
 * localSettings for application
 * @example
 * var localConfig = require('./config').localSettings()
 */
module.exports = function() {
	return {
		// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
		host: 'localhost',
		port: 8000
	};
};
