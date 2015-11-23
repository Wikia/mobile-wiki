/**
 * localSettings for application, used by default by dev environment
 */
import baseExtendSettings from './localSettings.base';
import deepExtend from 'deep-extend';

const localSettings = baseExtendSettings({
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
	clickstream: {
		auth: {
			enable: true,
			url: 'https://services.wikia-dev.com/clickstream/events/social'
		}
	}
});

/**
 * @param {*} customLocalSet
 * @returns {*}
 */
export default function extendSettings(customLocalSet) {
	return deepExtend(localSettings, customLocalSet);
}
