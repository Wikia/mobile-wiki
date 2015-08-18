/**
 * localSettings for application, used by default by dev environment
 */
import baseLocalSettings = require('./localSettings.base');
import Utils = require('../server/lib/Utils');
var deepExtend: any = require('deep-extend');

var localSettings = baseLocalSettings.getSettings({
	loggers: {
		default: 'debug'
	},
	authCookieDomain: '.wikia-dev.com',
	servicesDomain:'services.wikia-dev.com',
	helios: {
		host: 'https://services.wikia-dev.com/auth',
	},
	weppy: {
		enabled: false,
	},
	facebook: {
		appId: 881967318489580
	},
	optimizely: {
		account: '2441440871'
	},
	qualaroo: {
		scriptUrl: '//s3.amazonaws.com/ki.js/52510/dlS.js'
	},
});

export function getSettings(customLocalSet: any): LocalSettings {
	return deepExtend(localSettings, customLocalSet);
}
