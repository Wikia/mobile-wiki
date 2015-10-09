/// <reference path="../../config/localSettings.d.ts" />
/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/hoek/hoek.d.ts" />
/// <reference path="../../typings/mercury/mercury-server.d.ts" />
/// <reference path="../../typings/hapi/hapi.d.ts" />

import Hoek = require('hoek');
import Url = require('url');
import QueryString = require('querystring');

/**
 * Utility functions
 */

/**
 * Environment types
 */
export enum Environment {
	Prod,
	Verify,
	Preview,
	Sandbox,
	Dev,
	Testing
}

/**
 * @desc Get environment from string
 *
 * @param {string} environment Environment name
 * @param {Environment} fallbackEnvironment Fallback environment
 * @returns {Environment}
 */
export function getEnvironment (environment: string, fallbackEnvironment: Environment = Environment.Dev): Environment {
	var environments: {[id: string]: Environment} = {
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
 * @desc Get environment as string
 *
 * @param {Environment} environment
 * @return {string}
 */
export function getEnvironmentString (environment: Environment): string {
	return Environment[environment].toLowerCase();
}

/**
 * @desc Strip dev- prefix from devbox domain
 *
 * @returns {string}
 */
export function stripDevboxDomain (host: string): string {
	if (host && host.substring(0, 4) === 'dev-') {
		host = host.substring(4);
	}

	return host;
}

var wikiDomainsCache: { [key: string]: string; } = {};
/**
 * Get cached Media Wiki domain name from the request host
 *
 * @returns {string} Host name to use for API
 */
export function getCachedWikiDomainName (localSettings: LocalSettings, request: Hapi.Request): string {
	var wikiDomain: string,
		host = getHostFromRequest(request);

	host = clearHost(host);
	wikiDomain = wikiDomainsCache[host];

	return wikiDomainsCache[host] = wikiDomain ? wikiDomain : getWikiDomainName(localSettings, host);
}

/**
 * @desc Generate wiki host name from the request host
 *
 * @param localSettings
 * @param hostName
 * @returns {string}
 */
export function getWikiDomainName (localSettings: LocalSettings, hostName: string = ''): string {
	var regex: RegExp,
		match: RegExpMatchArray;

	if (isXipHost(localSettings, hostName)) {
		/**
		 * Regular expression for extracting wiki name from hostName.
		 * Wiki name is used for creating an url to devbox
		 * HostName looks like: mlp.127.0.0.1.xip.io.
		 * First match contains wiki name which is later used.
		 *
		 * @type {RegExp}
		 */
		regex = /^\.?(.+?)\.((?:[\d]{1,3}\.){3}[\d]{1,3}\.xip.io)$/;
		match = hostName.match(regex);
		return match ? match[1] + '.' + localSettings.devboxDomain + '.wikia-dev.com'  : hostName;
	} else {
		return hostName;
	}
}

/**
 * @desc Removes the port from hostname as well as ad domain aliases
 *
 * @param {string} host
 * @returns {string}
 */
export function clearHost (host: string): string {
	// We use two special domain prefixes for Ad Operation and Sales reasons
	// They behave similar to our staging prefixes but are not staging machines
	// Talk to Ad Engineering Team if you want to learn more
	var adDomainAliases: Array<string> = ['externaltest', 'showcase'];

	host = host.split(':')[0]; // get rid of port
	Object.keys(adDomainAliases).forEach(function (key): void {
		if (host.indexOf(adDomainAliases[key]) === 0) {
			host = host.replace(adDomainAliases[key] + '.', ''); // get rid of domain aliases
		}
	});

	return host;
}

/**
 * @desc Get vertical color from localSettings
 *
 * @param {LocalSettings} localSettings
 * @param {string} vertical
 * @return {string}
 */
export function getVerticalColor (localSettings: LocalSettings, vertical: string): string {
	if (localSettings.verticalColors.hasOwnProperty(vertical)) {
		return localSettings.verticalColors[vertical];
	}
	return null;
}

export function parseQueryParams (obj: any, allowedKeys: string[]): any {
	var parsed: any = {},
		rawProp: string,
		prop: any;

	if (allowedKeys instanceof Array) {
		allowedKeys.forEach(key => {
			if (obj.hasOwnProperty(key)) {
				rawProp = obj[key];

				if (!isNaN(+rawProp)) {
					prop = +rawProp;
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
 */
export function shouldAsyncArticle(localSettings: LocalSettings, host: string): boolean {
	return localSettings.asyncArticle.some((communityName: string) => !!host.match(communityName));
}

/**
 * Create server data
 *
 * @returns ServerData
 */
export function createServerData(localSettings: LocalSettings, wikiDomain: string = ''): ServerData {
	// if no environment, pass dev
	var env = typeof localSettings.environment === 'number' ? localSettings.environment : Environment.Dev,
		data: any = {
			mediawikiDomain: getWikiDomainName(localSettings, wikiDomain),
			apiBase: localSettings.apiBase,
			environment: getEnvironmentString(env),
			cdnBaseUrl: getCDNBaseUrl(localSettings)
		};

	if (localSettings.optimizely.enabled) {
		data.optimizelyScript = localSettings.optimizely.scriptPath + localSettings.optimizely.account + '.js';
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
export function getStaticAssetPath(localSettings: LocalSettings, request: Hapi.Request): string {
	var env = typeof localSettings.environment === 'number' ? localSettings.environment : Environment.Dev;
	return env !== Environment.Dev
		// The CDN path should match what's used in https://github.com/Wikia/mercury/blob/dev/gulp/options/prod.js
		? localSettings.cdnBaseUrl + '/mercury-static/'
		: '//' + getCachedWikiDomainName(localSettings, request) + '/front/';
}

export function getCDNBaseUrl(localSettings: LocalSettings): String {
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
 * @param request
 * @returns {string}
 */
export function getHostFromRequest(request: Hapi.Request): string {
	return request.headers['x-original-host'] || request.headers.host;
}

export function isXipHost(localSettings: LocalSettings, hostName: string): boolean {
	return localSettings.environment === Environment.Dev &&
		hostName.search(/(?:[\d]{1,3}\.){4}xip\.io$/) !== -1;
}

/**
 * If user tried to load wiki by its alternative URL then redirect to the primary one based on wikiVariables.basePath
 * If it's a local machine then ignore, no point in redirecting to devbox
 * Throws RedirectedToCanonicalHost so promises can catch it and handle properly
 *
 * @param localSettings
 * @param request
 * @param reply
 * @param wikiVariables
 * @throws RedirectedToCanonicalHost
 */
export function redirectToCanonicalHostIfNeeded(
	localSettings: LocalSettings, request: Hapi.Request, reply: Hapi.Response, wikiVariables: any
): void {
	var requestedHost = getCachedWikiDomainName(localSettings, request),
		canonicalHost = Url.parse(wikiVariables.basePath).hostname,
		isLocal = isXipHost(localSettings, clearHost(getHostFromRequest(request))),
		redirectLocation: string;

	if (!isLocal && requestedHost !== canonicalHost) {
		redirectLocation = wikiVariables.basePath + request.path;

		if (Object.keys(request.query).length > 0) {
			redirectLocation += '?' + QueryString.stringify(request.query);
		}

		reply.redirect(redirectLocation).permanent(true);
		throw new RedirectedToCanonicalHost();
	}
}

export class RedirectedToCanonicalHost {
	constructor () {
		Error.apply(this, arguments);
	}
}

RedirectedToCanonicalHost.prototype = Object.create(Error.prototype);
