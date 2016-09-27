import Ember from 'ember';

/**
 * @param {string} url
 * @param {Object} [params={}]
 * @returns {string}
 */
export function addQueryParams(url, params = {}) {
	const paramsString = Ember.$.param(params);

	if (paramsString.length > 0) {
		if (url.indexOf('?') === -1) {
			url = `${url}?`;
		} else {
			url = `${url}&`;
		}
	}

	return `${url}${paramsString}`;
}
