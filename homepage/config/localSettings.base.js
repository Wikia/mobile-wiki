/**
 * Base localSettings for application
 */

var deepExtend = require('deep-extend'),
	localSettings = {
	// Base domain for cookies
	authCookieDomain: 'wikia.com',
	// Targeted environment [prod|preview|verify|dev|testing]
	//environment: Utils.getEnvironment(process.env.WIKIA_ENVIRONMENT),
	// Login
	helios: {
		host: process.env.HELIOS_HOST,
		usernameMaxLength: 50,
		passwordMaxLength: 50
	},
	host: process.env.HOST,
	mediawikiDomain: process.env.MEDIAWIKI_DOMAIN || null,
	//devboxDomain: Utils.stripDevboxDomain(process.env.HOST || process.env.LOGNAME),
	port: process.env.PORT || 8111,

};

function getSettings(customLocalSet) {
	return deepExtend(localSettings, customLocalSet);
}

exports.getSettings = getSettings;
