/**
 * Utility functions
 */

import Hoek from 'hoek';
import Url from 'url';
import QueryString from 'querystring';

/**
 * @typedef {Object} ServerData
 * @property {string} mediawikiDomain
 * @property {string} apiBase
 * @property {string} environment
 * @property {string} cdnBaseURL
 * @property {string} gaUrl
 * @property {string} [optimizelyScript]
 */

// Environment types
const Environment = {
		Prod: 'prod',
		Verify: 'verify',
		Preview: 'preview',
		Sandbox: 'sandbox',
		Dev: 'dev',
		Testing: 'testing'
	},
	wikiDomainsCache = {};

export {Environment};
/**
 * Get environment from string
 *
 * @param {string} environment Environment name
 * @param {Environment} fallbackEnvironment Fallback environment
 * @returns {Environment}
 */
export function getEnvironment(environment, fallbackEnvironment = Environment.Dev) {
	const environments = {
		prod: Environment.Prod,
		verify: Environment.Verify,
		preview: Environment.Preview,
		sandbox: Environment.Sandbox,
		dev: Environment.Dev,
		testing: Environment.Testing
	};

	if (environments.hasOwnProperty(environment)) {
		return environments[environment];
	}
	return fallbackEnvironment;
}

/**
 * Get environment as string
 *
 * @param {String} environment
 * @returns {string}
 */
export function getEnvironmentString(environment) {
	return getEnvironment(environment).toLowerCase();
}

/**
 * Strip dev- prefix from devbox domain
 *
 * @param {string} host
 * @returns {string}
 */
export function stripDevboxDomain(host) {
	if (host && host.substring(0, 4) === 'dev-') {
		host = host.substring(4);
	}

	return host;
}

/**
 * @param {LocalSettings} localSettings
 * @param {string} hostName
 * @returns {boolean}
 */
export function isXipHost(localSettings, hostName) {
	return localSettings.environment === Environment.Dev &&
		hostName.search(/(?:[\d]{1,3}\.){4}xip\.io$/) !== -1;
}

/**
 * @param {LocalSettings} localSettings
 * @returns {string}
 */
export function getCDNBaseUrl(localSettings) {
	return localSettings.environment !== Environment.Dev ? localSettings.cdnBaseUrl : '';
}

/**
 * Get Host from request. First check if x-original-host exists.
 * Header x-original-host is added by Fastly and represents the host name of resource requested by user.
 * If x-original-host header doesn't exist check host header.
 * When request goes through Fastly host header contains original host with stripped staging env.
 * For instance for preview.muppet.wikia.com host is muppet.wikia.com.
 * When request doesn't go through Fastly (local environment) host header contains original host
 *
 * @param {Hapi.Request} request
 * @returns {string}
 */
export function getHostFromRequest(request) {
	return request.headers['x-original-host'] || request.headers.host;
}

/**
 * Generate wiki host name from the request host
 *
 * @param {LocalSettings} localSettings
 * @param {string} [hostName='']
 * @returns {string}
 */
export function getWikiDomainName(localSettings, hostName = '') {
	if (isXipHost(localSettings, hostName)) {
		/**
		 * Regular expression for extracting wiki name from hostName.
		 * Wiki name is used for creating an url to devbox
		 * HostName looks like: mlp.127.0.0.1.xip.io.
		 * First match contains wiki name which is later used.
		 */
		const regex = /^\.?(.+?)\.((?:[\d]{1,3}\.){3}[\d]{1,3}\.xip.io)$/,
			match = hostName.match(regex);

		return match ? `${match[1]}.${localSettings.devboxDomain}.wikia-dev.com` : hostName;
	} else {
		return hostName;
	}
}

/**
 * Get the subdomain of a given Wikia host
 *
 * @param {string} host
 * @returns {string}
 */
export function getWikiaSubdomain(host) {
	return host.replace(
		/^(?:(?:verify|preview|sandbox-[^.]+)\.)?([a-z\d.]*[a-z\d])\.(?:wikia|[a-z\d]+\.wikia-dev)?\.com/,
		'$1'
	);
}

/**
 * Removes the port from hostname as well as ad domain aliases
 *
 * @param {string} host
 * @returns {string}
 */
export function clearHost(host) {
	// We use two special domain prefixes for Ad Operation and Sales reasons
	// They behave similar to our staging prefixes but are not staging machines
	// Talk to Ad Engineering Team if you want to learn more
	const adDomainAliases = ['externaltest', 'showcase'];

	// get rid of port
	host = host.split(':')[0];

	// get rid of domain aliases
	/**
	 * @param {*} key
	 * @returns {void}
	 */
	Object.keys(adDomainAliases).forEach((key) => {
		if (host.indexOf(adDomainAliases[key]) === 0) {
			host = host.replace(`${adDomainAliases[key]}.`, '');
		}
	});

	return host;
}

/**
 * Get cached Media Wiki domain name from the request host
 *
 * @param {LocalSettings} localSettings
 * @param {Hapi.Request} request
 * @returns {string} Host name to use for API
 */
export function getCachedWikiDomainName(localSettings, request) {
	const host = clearHost(getHostFromRequest(request)),
		wikiDomain = wikiDomainsCache[host];

	wikiDomainsCache[host] = wikiDomain ? wikiDomain : getWikiDomainName(localSettings, host);

	return wikiDomainsCache[host];
}

/**
 * Get vertical color from localSettings
 *
 * @param {LocalSettings} localSettings
 * @param {string} vertical
 * @returns {string}
 */
export function getVerticalColor(localSettings, vertical) {
	if (localSettings.verticalColors.hasOwnProperty(vertical)) {
		return localSettings.verticalColors[vertical];
	}
	return null;
}

/**
 * @param {*} obj
 * @param {string[]} allowedKeys - a whitelist of acceptable parameter names
 * @returns {*}
 */
export function parseQueryParams(obj, allowedKeys) {
	const parsed = {};

	if (allowedKeys instanceof Array) {
		/**
		 * @param {*} key
		 * @returns {void}
		 */
		allowedKeys.forEach((key) => {
			if (obj.hasOwnProperty(key)) {
				const rawProp = obj[key];

				let prop;

				if (!isNaN(rawProp)) {
					prop = rawProp;
				} else if (rawProp.toLowerCase() === 'true') {
					prop = true;
				} else if (rawProp.toLowerCase() === 'false') {
					prop = false;
				} else {
					prop = Hoek.escapeHtml(rawProp);
				}

				parsed[key] = prop;
			}
		});
	}

	return parsed;
}

/**
 * (HG-753) This allows for loading article content asynchronously while providing a version of the page with
 * article content that search engines can still crawl.
 * @see https://developers.google.com/webmasters/ajax-crawling/docs/specification
 *
 * @param {LocalSettings} localSettings
 * @param {string} host
 * @returns {boolean}
 */
export function shouldAsyncArticle(localSettings, host) {
	/**
	 * @param {string} communityName
	 * @returns {boolean}
	 */
	return localSettings.asyncArticle.some((communityName) => Boolean(host.match(communityName)));
}

/**
 * Create server data
 *
 * @param {LocalSettings} localSettings
 * @param {string} [wikiDomain='']
 * @returns {ServerData}
 */
export function createServerData(localSettings, wikiDomain = '') {
	// if no environment, pass dev
	const env = localSettings.environment || Environment.Dev,
		data = {
			mediawikiDomain: getWikiDomainName(localSettings, wikiDomain),
			apiBase: localSettings.apiBase,
			environment: getEnvironmentString(env),
			cdnBaseUrl: getCDNBaseUrl(localSettings),
			gaUrl: localSettings.tracking.ua.scriptUrl
		};

	if (localSettings.optimizely.enabled) {
		data.optimizelyScript = `${localSettings.optimizely.scriptPath}${localSettings.optimizely.account}.js`;
	}

	return data;
}

/**
 * Gets the domain and path for a static asset
 *
 * @param {LocalSettings} localSettings
 * @param {Hapi.Request} request
 * @returns {string}
 */
export function getStaticAssetPath(localSettings, request) {
	const env = typeof localSettings.environment === 'number' ? localSettings.environment : Environment.Dev;

	return env !== Environment.Dev ?
		// The CDN path should match what's used in https://github.com/Wikia/mercury/blob/dev/gulp/options/prod.js
		`${localSettings.cdnBaseUrl}/mercury-static/` :
		`//${getCachedWikiDomainName(localSettings, request)}/front/`;
}

/**
 * @class RedirectedToCanonicalHost
 */
export class RedirectedToCanonicalHost {
	/**
	 * @param {*} data
	 * @returns {void}
	 */
	constructor(data) {
		Error.apply(this, arguments);
		this.data = data;
	}
}
RedirectedToCanonicalHost.prototype = Object.create(Error.prototype);

/**
 * If user tried to load wiki by its alternative URL then redirect to the primary one based on wikiVariables.basePath
 * If it's a local machine then ignore, no point in redirecting to devbox
 * Throws RedirectedToCanonicalHost so promises can catch it and handle properly
 *
 * @param {LocalSettings} localSettings
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {*} wikiVariables
 * @returns {void}
 *
 * @throws RedirectedToCanonicalHost
 */
export function redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables) {
	const requestedHost = getCachedWikiDomainName(localSettings, request),
		canonicalHost = Url.parse(wikiVariables.basePath).hostname,
		isLocal = isXipHost(localSettings, clearHost(getHostFromRequest(request)));

	if (!isLocal && requestedHost !== canonicalHost) {
		let redirectLocation = wikiVariables.basePath + request.path;

		if (Object.keys(request.query).length > 0) {
			redirectLocation += `?${QueryString.stringify(request.query)}`;
		}

		reply.redirect(redirectLocation).permanent(true);
		throw new RedirectedToCanonicalHost();
	}
}

/**
 * Get HTML title
 *
 * @param {*} wikiVariables
 * @param {string} displayTitle
 * @returns {string}
 */
export function getHtmlTitle(wikiVariables, displayTitle) {
	const htmlTitleTemplate = (wikiVariables.htmlTitleTemplate) ? wikiVariables.htmlTitleTemplate : '$1 - Wikia';

	if (displayTitle) {
		return htmlTitleTemplate.replace('$1', displayTitle);
	}
	return htmlTitleTemplate.replace('$1 - ', '');
}
