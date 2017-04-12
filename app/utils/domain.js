import Ember from 'ember';

/**
 * @param {string} url
 * @returns {string}
 */
export function extractDomainFromUrl(url) {
	const domain = (
			/^(?:https?\:\/\/)?((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(?:[\/?#]|$)/i
		).exec(url);

	return Ember.isArray(domain) ? domain[1] : null;
}
