/// <reference path='../../mercury.ts' />
/// <reference path="../../mercury.d.ts" />
interface UrlParams {
	namespace?: string;
	path?: string;
	protocol?: string;
	query?: any;
	title?: string;
	wiki?: string;
}

module Mercury.Utils {
	/**
	 * This function constructs a URL given pieces of a typical Wikia URL. All URL
	 * parts are optional. Passing in empty params will result in the site home page,
	 * ie. www.wikia.com.
	 *
	 * Some example parameters and results:
	 *
	 *   {path: '/login', query: {redirect: '/somepage'}}
	 *   ...returns '//www.wikia.com/login?redirect=%2Fsomepage'
	 *
	 *   {wiki: 'glee', title: 'Jeff'}
	 *   ...returns '//glee.wikia.com/wiki/Jeff'
	 *
	 *   {wiki: 'community', namespace: 'User', title: 'JaneDoe', path: '/preferences'}
	 *   ...returns '//community.wikia.com/wiki/User:JaneDoe/preferences'
	 *
	 * @param {object} urlParams
	 * @config {string} [namespace] MediaWiki article namespace
	 * @config {string} [path] Additional URL path appended to the end of the URL before the querystring
	 * @config {string} [protocol] Protocol
	 * @config {object} [query] Querystring data, which is converted to a string and properly escaped
	 * @config {string} [title] Article title
	 * @config {string} [wiki] Wiki name, as it would be used as a subdomain
	 * @param {object} context Window context
	 * @returns {string}
	 */
	export function buildUrl (urlParams: UrlParams = {}, context: any = window): string {
		var domain: string,
			host: string = context.location.host,
			match: Array<string>,
			url: string;

		if (!urlParams.protocol) {
			urlParams.protocol = 'http';
		}

		url = urlParams.protocol + '://';

		if (!urlParams.wiki) {
			// If no wiki subdomain, use www
			urlParams.wiki = 'www';
		}

		// Here we try to see which environment the host is, and substitute the wiki name accordingly
		// (1) Sandbox, preview, or verify hosts on wikia.com
		if ((match = host.match(/^(sandbox-.+?|preview|verify)\.(.+?)\.wikia\.com($|\/|:)/)) !== null) {
			host = host.replace(match[1] + '.' + match[2], match[1] + '.' + urlParams.wiki);
		// (2) Production wikia.com
		} else if ((match = host.match(/^(.+?)\.wikia\.com($|\/|:)/)) !== null) {
			// Domain is specified here in case subdomain is actually "wiki", "com", etc.
			host = host.replace(match[1] + '.wikia.com', urlParams.wiki + '.wikia.com');
		// (3) Devbox hosted on wikia-dev.com, wikia-dev.us, wikia-dev.pl, etc.
		} else if ((match = host.match(/^(.+)\.(.+?)\.wikia-dev.\w{2,3}($|\/|:)/)) !== null) {
			host = host.replace(match[1] + '.' + match[2], urlParams.wiki + '.' + match[2]);
		// (4) Environment using xip.io
		} else if ((match = host.match(/^(.+)\.(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\.xip\.io($|\/|:)/)) !== null) {
			host = host.replace(match[1] + '.' + match[2] + '.xip.io', urlParams.wiki + '.' + match[2] + '.xip.io');
		}

		// At this point, in the case of an unknown local host where the wiki is not in the
		// host string (ie. "mercury:8000"), it will be left unmodified and used as-is.
		url += host;

		if (urlParams.title) {
			url += Mercury.wiki.articlePath + (urlParams.namespace ? urlParams.namespace + ':' : '') + urlParams.title;
		}

		if (urlParams.path) {
			url += urlParams.path;
		}

		if (urlParams.query) {
			url += '?';
			url += Object.keys(urlParams.query).map((key: string): string =>
				`${encodeURIComponent(key)}=${encodeURIComponent(urlParams.query[key])}`
			).join('&');
		}

		return url; 
	}
}
