/**
 * localSettings for application, used by default by dev environment
 */
import baseLocalSettings = require('./localSettings.base');
import Utils = require('../server/lib/Utils');
var deepExtend: any = require('deep-extend');

var localSettings = baseLocalSettings.extendSettings({
	loggers: {
		console: 'debug'
	},
	authCookieDomain: '.wikia-dev.com',
	servicesDomain: (process.env.WIKIA_DATACENTER === 'poz') ? 'services-poz.wikia-dev.com' : 'services.wikia-dev.com',
	facebook: {
		appId: 881967318489580
	},
	optimizely: {
		account: '2441440871'
	},
	qualaroo: {
		scriptUrl: '//s3.amazonaws.com/ki.js/52510/dlS.js'
	},
	port: 7000,
	enableDiscussions: true,
	enableAuthLogger: false
});

export function extendSettings(customLocalSet: any): LocalSettings {
	return deepExtend(localSettings, customLocalSet);
}
