import config from '../config/environment';
import {escapeRegex} from './string';

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
 * This function constructs a URL given pieces of a typical Wikia URL. All URL
 * parts are optional. Passing in empty params will output the root index URL
 * of the current host.
 *
 * Some example parameters and results:
 *
 *   {host: 'glee.wikia.com', path: '/login', query: {redirect: '/somepage'}}
 *   ...returns 'http://www.wikia.com/login?redirect=%2Fsomepage'
 *
 *   {host: 'glee.wikia.com', title: 'Jeff'}
 *   ...returns 'http://glee.wikia.com/wiki/Jeff'
 *
 *   {host: 'glee.wikia.com', namespace: 'User', title: 'JaneDoe', path: '/preferences'}
 *   ...returns 'http://glee.wikia.com/wiki/User:JaneDoe/preferences'
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
		url += `${urlParams.protocol}://${host}`;
	}

	if (urlParams.langPath) {
		url += urlParams.langPath;
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
