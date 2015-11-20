/**
 * Utility functions
 */

const Hoek = require('hoek'),
	Url = require('url'),
	QueryString = require('querystring'),
	// Environment types
	Environment = {
		Prod: 'Prod',
		Verify: 'Verify',
		Preview: 'Preview',
		Sandbox: 'Sandbox',
		Dev: 'Dev',
		Testing: 'Testing'
	},
	wikiDomainsCache = {};

exports.Environment = Environment;

/**
 * Get environment from string
 *
 * @param {string} environment Environment name
 * @param {Environment} fallbackEnvironment Fallback environment
 * @returns {Environment}
 */
function getEnvironment(environment, fallbackEnvironment = Environment.Dev) {
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

exports.getEnvironment = getEnvironment;

/**
 * Get environment as string
 *
 * @param {Environment} environment
 * @returns {string}
 */
function getEnvironmentString(environment) {
	return Environment[environment].toLowerCase();
}

exports.getEnvironmentString = getEnvironmentString;

/**
 * Strip dev- prefix from devbox domain
 *
 * @param {string} host
 * @returns {string}
 */
function stripDevboxDomain(host) {
	if (host && host.substring(0, 4) === 'dev-') {
		host = host.substring(4);
	}

	return host;
}

exports.stripDevboxDomain = stripDevboxDomain;

/**
 * @param {LocalSettings} localSettings
 * @param {string} hostName
 * @returns {boolean}
 */
function isXipHost(localSettings, hostName) {
	return localSettings.environment === Environment.Dev &&
		hostName.search(/(?:[\d]{1,3}\.){4}xip\.io$/) !== -1;
}

exports.isXipHost = isXipHost;

/**
 * @param {LocalSettings} localSettings
 * @returns {string}
 */
function getCDNBaseUrl(localSettings) {
	return localSettings.environment !== Environment.Dev ? localSettings.cdnBaseUrl : '';
}

exports.getCDNBaseUrl = getCDNBaseUrl;

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
function getHostFromRequest(request) {
	return request.headers['x-original-host'] || request.headers.host;
}

exports.getHostFromRequest = getHostFromRequest;

/**
 * Generate wiki host name from the request host
 *
 * @param {LocalSettings} localSettings
 * @param {string} [hostName='']
 * @returns {string}
 */
function getWikiDomainName(localSettings, hostName = '') {
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

exports.getWikiDomainName = getWikiDomainName;

/**
 * Get the subdomain of a given Wikia host
 *
 * @param {string} host
 * @returns {string}
 */
function getWikiaSubdomain(host) {
	return host.replace(
		/^(?:(?:verify|preview|sandbox-[^.]+)\.)?([a-z\d.]*[a-z\d])\.(?:wikia|[a-z\d]+\.wikia-dev)?\.com/,
		'$1'
	);
}

exports.getWikiaSubdomain = getWikiaSubdomain;

/**
 * Removes the port from hostname as well as ad domain aliases
 *
 * @param {string} host
 * @returns {string}
 */
function clearHost(host) {
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

exports.clearHost = clearHost;

/**
 * Get cached Media Wiki domain name from the request host
 *
 * @param {LocalSettings} localSettings
 * @param {Hapi.Request} request
 * @returns {string} Host name to use for API
 */
function getCachedWikiDomainName(localSettings, request) {
	const host = clearHost(getHostFromRequest(request)),
		wikiDomain = wikiDomainsCache[host];

	wikiDomainsCache[host] = wikiDomain ? wikiDomain : getWikiDomainName(localSettings, host);

	return wikiDomainsCache[host];
}

exports.getCachedWikiDomainName = getCachedWikiDomainName;

/**
 * Get vertical color from localSettings
 *
 * @param {LocalSettings} localSettings
 * @param {string} vertical
 * @returns {string}
 */
function getVerticalColor(localSettings, vertical) {
	if (localSettings.verticalColors.hasOwnProperty(vertical)) {
		return localSettings.verticalColors[vertical];
	}
	return null;
}

exports.getVerticalColor = getVerticalColor;

/**
 * @param {*} obj
 * @param {string[]} allowedKeys
 * @returns {*}
 */
function parseQueryParams(obj, allowedKeys) {
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

exports.parseQueryParams = parseQueryParams;

/**
 * (HG-753) This allows for loading article content asynchronously while providing a version of the page with
 * article content that search engines can still crawl.
 * @see https://developers.google.com/webmasters/ajax-crawling/docs/specification
 *
 * @param {LocalSettings} localSettings
 * @param {string} host
 * @returns {boolean}
 */
function shouldAsyncArticle(localSettings, host) {
	/**
	 * @param {string} communityName
	 * @returns {boolean}
	 */
	return localSettings.asyncArticle.some((communityName) => Boolean(host.match(communityName)));
}

exports.shouldAsyncArticle = shouldAsyncArticle;

/**
 * Create server data
 *
 * @param {LocalSettings} localSettings
 * @param {string} [wikiDomain='']
 * @returns {ServerData}
 */
function createServerData(localSettings, wikiDomain = '') {
	// if no environment, pass dev
	const env = typeof localSettings.environment === 'number' ? localSettings.environment : Environment.Dev,
		data = {
			mediawikiDomain: getWikiDomainName(localSettings, wikiDomain),
			apiBase: localSettings.apiBase,
			environment: getEnvironmentString(env),
			cdnBaseUrl: getCDNBaseUrl(localSettings)
		};

	if (localSettings.optimizely.enabled) {
		data.optimizelyScript = `${localSettings.optimizely.scriptPath}${localSettings.optimizely.account}.js`;
	}

	return data;
}

exports.createServerData = createServerData;

/**
 * Gets the domain and path for a static asset
 *
 * @param {LocalSettings} localSettings
 * @param {Hapi.Request} request
 * @returns {string}
 */
function getStaticAssetPath(localSettings, request) {
	const env = typeof localSettings.environment === 'number' ? localSettings.environment : Environment.Dev;

	return env !== Environment.Dev ?
		// The CDN path should match what's used in https://github.com/Wikia/mercury/blob/dev/gulp/options/prod.js
		`${localSettings.cdnBaseUrl}/mercury-static/` :
		`//${getCachedWikiDomainName(localSettings, request)}/front/`;
}

exports.getStaticAssetPath = getStaticAssetPath;

/**
 * @class RedirectedToCanonicalHost
 */
class RedirectedToCanonicalHost {
	/**
	 * @returns {void}
	 */
	constructor() {
		Error.apply(this, arguments);
	}
}

RedirectedToCanonicalHost.prototype = Object.create(Error.prototype);

exports.RedirectedToCanonicalHost = RedirectedToCanonicalHost;

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
function redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables) {
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

exports.redirectToCanonicalHostIfNeeded = redirectToCanonicalHostIfNeeded;

/**
 * Get HTML title
 *
 * @param {*} wikiVariables
 * @param {string} displayTitle
 * @returns {string}
 */
function getHtmlTitle(wikiVariables, displayTitle) {
	const htmlTitleTemplate = (wikiVariables.htmlTitleTemplate) ? wikiVariables.htmlTitleTemplate : '$1 - Wikia';

	if (displayTitle) {
		return htmlTitleTemplate.replace('$1', displayTitle);
	}
	return htmlTitleTemplate.substring(5);
}

exports.getHtmlTitle = getHtmlTitle;
