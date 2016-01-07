/**
 * Base localSettings for application
 */

var deepExtend = require('deep-extend'),
	localSettings = {
		// Base domain for cookies
		authCookieDomain: 'wikia.com',
		// Targeted environment [prod|preview|verify|dev|testing]
		//environment: Utils.getEnvironment(process.env.WIKIA_ENVIRONMENT),

		helios: {
			path: '/auth',
			usernameMaxLength: 50,
			passwordMaxLength: 50
		},
		whoAmIService: {
			path: '/whoami',
			timeout: 3000
		},
		host: process.env.HOST,
		logger: 'syslog',
		loginUrl: 'https://www.wikia.com/signin?uselang=ja&redirect=http://ja.wikia.com',
		mediawikiDomain: process.env.MEDIAWIKI_DOMAIN || null,
		//devboxDomain: Utils.stripDevboxDomain(process.env.HOST || process.env.LOGNAME),
		port: process.env.PORT || 8111,
		servicesUrl: 'https://services.wikia.com/',
		apiUrl: 'http://wikia.com/api/v1/',
		signupUrl: 'https://www.wikia.com/register?uselang=ja&redirect=http://ja.wikia.com',
	};

function extendSettings(customLocalSet) {
	return deepExtend(localSettings, customLocalSet);
}

exports.extendSettings = extendSettings;
