/**
 * Utility functions
 */

import {applyToDefaults, escapeHtml} from 'hoek';
import {parse} from 'url';
import {stringify} from 'querystring';
import {RedirectedToCanonicalHost} from './custom-errors';
import Promise from 'bluebird';

/**
 * @typedef {Object} ServerData
 * @property {string} mediawikiDomain
 * @property {string} environments
 * @property {string} cdnBaseURL
 * @property {string} gaUrl
 * @property {string} [optimizelyScript]
 */

// Environment types
const environments = {
		dev: 'dev',
		preview: 'preview',
		prod: 'prod',
		sandbox: 'sandbox',
		stable: 'stable',
		staging: 'staging',
		testing: 'testing',
		verify: 'verify',
	},
	wikiDomainsCache = {};

export {environments};
/**
 * Get environments from string
 *
 * @param {string} environment Environment name
 * @param {string} fallbackEnvironment Fallback environments
 * @returns {string}
 */
export function getEnvironment(environment, fallbackEnvironment = environments.dev) {
	if (environments.hasOwnProperty(environment)) {
		return environments[environment];
	}

	return fallbackEnvironment;
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
 * @param {Settings} settings
 * @param {string} hostName
 * @returns {boolean}
 */
export function isXipHost(settings, hostName) {
	return settings.environment === environments.dev &&
		hostName.search(/(?:[\d]{1,3}\.){4}xip\.io$/) !== -1;
}

/**
 * @param {Settings} settings
 * @returns {string}
 */
export function getCDNBaseUrl(settings) {
	return (settings.environment !== environments.dev) ? settings.cdnBaseUrl : '';
}

/**
 * Get Host from request. First check if x-original-host exists.
 * Header x-original-host is added by Fastly and represents the host name of resource requested by
 * user. If x-original-host header doesn't exist check host header. When request goes through
 * Fastly host header contains original host with stripped staging env. For instance for
 * preview.muppet.wikia.com host is muppet.wikia.com. When request doesn't go through Fastly (local
 * environments) host header contains original host
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
 * @param {Settings} settings
 * @param {string} [hostName='']
 * @returns {string}
 */
export function getWikiDomainName(settings, hostName = '') {
	if (isXipHost(settings, hostName)) {
		/**
		 * Regular expression for extracting wiki name from hostName.
		 * Wiki name is used for creating an url to devbox
		 * HostName looks like: mlp.127.0.0.1.xip.io.
		 * First match contains wiki name which is later used.
		 */
		const regex = /^\.?(.+?)\.((?:[\d]{1,3}\.){3}[\d]{1,3}\.xip.io)$/,
			match = hostName.match(regex);

		return match ? `${match[1]}.${settings.devboxDomain}.wikia-dev.com` : hostName;
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
	return host.replace(new RegExp(
			'^(?:(?:verify|preview|stable|sandbox-[^.]+)\\.)?' +
			'([a-z\\d.]*[a-z\d])\\.' +
			'(?:wikia|wikia-staging|[a-z\\d]+\\.wikia-dev)?\\.com'
		),
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
 * @param {Settings} settings
 * @param {Hapi.Request} request
 * @returns {string} Host name to use for API
 */
export function getCachedWikiDomainName(settings, request) {
	const host = clearHost(getHostFromRequest(request)),
		wikiDomain = wikiDomainsCache[host];

	wikiDomainsCache[host] = wikiDomain ? wikiDomain : getWikiDomainName(settings, host);

	return wikiDomainsCache[host];
}

/**
 * @param {Settings} settings
 * @param {string} wikiDomain
 * @returns {string}
 */
export function getCorporatePageUrlFromWikiDomain(settings, wikiDomain) {
	let environmentPrefix;

	switch (settings.environment) {
		case environments.prod:
			return 'www.wikia.com';
		case environments.staging:
			return 'www.wikia-staging.com';
		case environments.dev:
			return `www.${settings.devboxDomain}.wikia-dev.com`;
		default:
			environmentPrefix = wikiDomain.substring(0, wikiDomain.indexOf('.'));
			return `${environmentPrefix}.www.wikia.com`;
	}
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
					prop = escapeHtml(rawProp);
				}

				parsed[key] = prop;
			}
		});
	}

	return parsed;
}

/**
 * Create server data
 *
 * @param {Settings} settings
 * @param {string} [wikiDomain='']
 * @returns {ServerData}
 */
export function createServerData(settings, wikiDomain = '') {
	// if no environment, pass dev
	const env = settings.environment || environments.dev,
		data = {
			mediawikiDomain: getWikiDomainName(settings, wikiDomain),
			environment: getEnvironment(env),
			cdnBaseUrl: getCDNBaseUrl(settings),
			gaUrl: settings.tracking.ua.scriptUrl
		};

	if (settings.qualaroo.enabled) {
		data.qualarooScript = settings.qualaroo.scriptUrl;
	}

	if (settings.optimizely.enabled) {
		data.optimizelyScript = `${settings.optimizely.scriptPath}${settings.optimizely.account}.js`;
	}

	return data;
}

/**
 * Gets the domain and path for a static asset
 *
 * @param {Settings} settings
 * @param {Hapi.Request} request
 * @returns {string}
 */
export function getStaticAssetPath(settings, request) {
	const env = settings.environment || environments.dev;

	return env !== environments.dev ?
		// The CDN path should match what's used in
		// https://github.com/Wikia/mercury/blob/dev/gulp/options/prod.js
		`${settings.cdnBaseUrl}/mercury-static/` :
		`//${getCachedWikiDomainName(settings, request)}/front/`;
}

/**
 * If user tried to load wiki by its alternative URL then redirect to the primary one based on
 * wikiVariables.basePath If it's a local machine then ignore, no point in redirecting to devbox
 * Throws RedirectedToCanonicalHost so promises can catch it and handle properly
 *
 * @param {Settings} settings
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {*} wikiVariables
 * @returns {void}
 *
 * @throws RedirectedToCanonicalHost
 */
export function redirectToCanonicalHostIfNeeded(settings, request, reply, wikiVariables) {
	const requestedHost = getCachedWikiDomainName(settings, request),
		canonicalHost = parse(wikiVariables.basePath).hostname,
		isLocal = isXipHost(settings, clearHost(getHostFromRequest(request)));

	if (!isLocal && requestedHost !== canonicalHost) {
		let redirectLocation = wikiVariables.basePath + request.path;

		if (Object.keys(request.query).length > 0) {
			redirectLocation += `?${stringify(request.query)}`;
		}

		reply.redirect(redirectLocation).permanent(true);
		throw new RedirectedToCanonicalHost();
	}
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export function redirectToOasis(request, reply) {
	const queryParams = stringify(
		applyToDefaults(request.query, {
			useskin: 'oasis'
		})
	);

	reply.redirect(`${request.url.pathname}?${queryParams}`);
}

/**
 * @param {Hapi.Request} request
 * @param {object} wikiVariables
 * @returns {Promise}
 */
export function setI18nLang(request, wikiVariables) {
	const i18n = request.server.methods.i18n.getInstance();

	if (wikiVariables.language && wikiVariables.language.content) {
		return new Promise((resolve) => {
			return i18n.setLng(wikiVariables.language.content, resolve);
		});
	} else {
		return Promise.resolve();
	}
}
