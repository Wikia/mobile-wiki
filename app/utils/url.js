import config from '../config/environment';

/**
 * Converting and escaping Querystring object to string.
 *
 * @param {Object} [query={}] Querystring object
 * @returns {string}
 */
export function getQueryString(query = {}) {
	const queryArray = Object.keys(query);

	let queryString = '';

	if (queryArray.length > 0) {
		queryString = `?${queryArray.map((key) => {
			if (query[key] instanceof Array) {
				if (query[key].length) {
					return query[key]
						.map((item) => `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`)
						.join('&');
				}
			} else {
				return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
			}
		}).join('&')}`;
	}

	return queryString;
}

/**
 * Substitutes the wiki name in a host string with a new wiki name
 *
 * @param {string} host - A host string (may include port number) from any Wikia environment
 * @param {string} wiki - The new wiki, which may contain a language prefix; for example, "glee" or "es.walkingdead"
 * @returns {string} New host
 */
function replaceWikiInHost(host, wiki) {
	let match;

	if ((match = host.match(/^(.+?)\.(sandbox-.+?|preview|verify)\.wikia\.com($|\/|:)/)) !== null) {
		// (1) Sandbox, preview, or verify hosts on wikia.com
		host = host.replace(`${match[1]}.${match[2]}`, `${wiki}.${match[2]}`);
	} else if ((match = host.match(/^(.+?)\.wikia\.com($|\/|:)/)) !== null) {
		// (2) Production wikia.com
		// Domain is specified here in case subdomain is actually "wiki", "com", etc.
		host = host.replace(`${match[1]}.wikia.com`, `${wiki}.wikia.com`);
	} else if ((match = host.match(/^(.+?)\.wikia-staging\.com($|\/|:)/)) !== null) {
		// (3) Staging env hosted on wikia-staging.com
		host = host.replace(`${match[1]}.wikia-staging.com`, `${wiki}.wikia-staging.com`);
	} else if ((match = host.match(/^(.+)\.(.+?)\.wikia-dev.\w{2,3}($|\/|:)/)) !== null) {
		// (4) Devbox hosted on wikia-dev.us, wikia-dev.pl, etc.
		host = host.replace(`${match[1]}.${match[2]}`, `${wiki}.${match[2]}`);
	} else if ((match = host.match(/^(.+)\.(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\.xip\.io($|\/|:)/)) !== null) {
		// (5) Environment using xip.io
		host = host.replace(`${match[1]}.${match[2]}.xip.io`, `${wiki}.${match[2]}.xip.io`);
	}

	// At this point, in the case of an unknown local host where the wiki is not in the
	// host string (ie. "mobile-wiki-s1:7001"), it will be left unmodified and returned as-is.
	return host;
}

/**
 * This function constructs a URL given pieces of a typical Wikia URL. All URL
 * parts are optional. Passing in empty params will output the root index URL
 * of the current host.
 *
 * Some example parameters and results:
 *
 *   {wiki: 'www', path: '/login', query: {redirect: '/somepage'}}
 *   ...returns 'http://www.wikia.com/login?redirect=%2Fsomepage'
 *
 *   {wiki: 'glee', title: 'Jeff'}
 *   ...returns 'http://glee.wikia.com/wiki/Jeff'
 *
 *   {wiki: 'community', namespace: 'User', title: 'JaneDoe', path: '/preferences'}
 *   ...returns 'http://community.wikia.com/wiki/User:JaneDoe/preferences'
 *
 * @param {Object} urlParams
 * @returns {string}
 */
export function buildUrl(urlParams = {}) {
	const host = urlParams.host;

	if (!urlParams.protocol) {
		if (window && window.location && window.location.protocol) {
			urlParams.protocol = window.location.protocol.replace(':', '');
		} else {
			urlParams.protocol = 'http';
		}
	}

	if (!urlParams.articlePath) {
		urlParams.articlePath = '/wiki/';
	}

	let url = '';

	if (!urlParams.relative) {
		url += `${urlParams.protocol}://`;

		if (urlParams.wiki) {
			url += replaceWikiInHost(host, urlParams.wiki);
		} else {
			url += host;
		}
	}

	if (urlParams.title) {
		url += urlParams.articlePath +
			(urlParams.namespace ? `${urlParams.namespace}:` : '') +
			encodeURIComponent(urlParams.title);
	}

	if (urlParams.wikiPage) {
		url += urlParams.articlePath + urlParams.wikiPage;
	}

	if (urlParams.path) {
		url += urlParams.path;
	}

	if (urlParams.query) {
		url += getQueryString(urlParams.query);
	}

	return url;
}

export function extractEncodedTitle(url) {
	return url ? url.replace(/^(https?:\/\/[^/]+)?(\/wiki)?\//, '') : '';
}

export function getOnSiteNotificationsServiceUrl(path = '') {
	return `https://${config.services.domain}/${config.services.onSiteNotifications.baseAPIPath}${path}`;
}
