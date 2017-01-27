/**
 * settings for application, used by default by dev environments
 */
export default {
	loggers: {
		console: 'debug'
	},
	devDomain: (process.env.WIKIA_DATACENTER === 'poz') ? 'pl' : 'us',
	authCookieDomain: (process.env.WIKIA_DATACENTER === 'poz') ? '.wikia-dev.pl' : '.wikia-dev.us',
	servicesDomain: (process.env.WIKIA_DATACENTER === 'poz') ? 'services.wikia-dev.pl' : 'services.wikia-dev.us',
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
		social: {
			enable: true,
			url: 'https://services.wikia-dev.com/clickstream/events/social'
		}
	},
	helios: {
		internalUrl: 'http://dev.helios.service.consul:9500/',
	},
};
