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
	facebook: {
		appId: 881967318489580
	},
	optimizely: {
		account: '2441440871'
	},
	qualaroo: {
		scriptUrl: '//s3.amazonaws.com/ki.js/52510/dlS.js'
	},
	//Default option on devboxes
	port: 7000
});

export function getSettings(customLocalSet: any): LocalSettings {
	return deepExtend(localSettings, customLocalSet);
}
