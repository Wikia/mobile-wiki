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

export function extractEncodedTitle(url) {
	return url ? url.replace(/^(https?:\/\/[^/]+)?(\/wiki)?\//, '') : '';
}

/**
 * @param {EventTarget} target
 * @returns {Boolean}
 */
export function isHashLink(target) {
	// We need to use getAttribute because target.href returns whole resolved URL instead of the original value
	return target.hasAttribute('href') && target.getAttribute('href').indexOf('#') === 0;
}

export function getOnSiteNotificationsServiceUrl(path = '') {
	return `https://${config.services.domain}/${config.services.onSiteNotifications.baseAPIPath}${path}`;
}
