/**
 * settings for the application, used by default by staging environments
 */
export default {
	// CDN prefix with no trailing slash
	cdnBaseUrl: '',
	servicesDomain: 'services.wikia-staging.com',
	domain: 'wikia-staging.com',
	mediawikiDomain: null,
	helios: {
		internalUrl: 'http://staging.helios.service.sjc.consul:9500/',
		path: '/auth',
		timeout: 3000
	},
	// auth pages aren't supported on custom domains, so this value should only be used for auth features
	// once we phase out custom domains, we can change this to "cookieDomain" and use it for more features
	authCookieDomain: '.wikia-staging.com',
	redirectUrlOnNoData: 'http://community.wikia-staging.com/wiki/Community_Central:Not_a_valid_Wikia',
	clickstream: {
		social: {
			enable: true,
			url: 'https://services.wikia-staging.com/clickstream/events/social'
		},
	},
};
