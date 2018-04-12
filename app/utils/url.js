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

export function extractEncodedTitle(url) {
	return url ? url.replace(/^(https?:\/\/[^/]+)?(\/wiki)?\//, '') : '';
}

export function getOnSiteNotificationsServiceUrl(path = '') {
	return `https://${config.services.domain}/${config.services.onSiteNotifications.baseAPIPath}${path}`;
}
