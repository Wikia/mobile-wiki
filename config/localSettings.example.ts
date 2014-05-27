/**
 * localSettings for application
 * @example
 * var localConfig = require('./config').localSettings
 */

var localSettings = {
	// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
	host:  'localhost',
	port: 8000,
	// Targeted environment [production|preview|verify|devbox_name]
	environment: 'production'
};

export = localSettings;
