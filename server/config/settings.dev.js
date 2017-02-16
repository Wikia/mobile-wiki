/**
 * settings for application, used by default by dev environments
 */
// These variables are used in multiple places in config
const devDomain = (process.env.WIKIA_DATACENTER === 'poz') ? 'pl' : 'us',
	servicesDomain = `services.wikia-dev.${devDomain}`;


export default {
	loggers: {
		console: 'debug'
	},
	devDomain,
	authCookieDomain: `.wikia-dev.${devDomain}`,
	servicesDomain,
	facebook: {
		appId: 881967318489580
	},
	optimizely: {
		account: '2441440871'
	},
	qualaroo: {
		scriptUrl: '//s3.amazonaws.com/ki.js/52510/dlS.js'
	},
	port: 7001,
	helios: {
		internalUrl: 'http://dev.helios.service.consul:9500/',
	},
};
