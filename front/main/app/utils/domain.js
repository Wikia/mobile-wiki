import Ember from 'ember';

/**
 * @param {string} [hostname=window.location.hostname]
 * @returns {string}
 */
export function getDomain(hostname = window.location.hostname) {
	const domain = (/[^.]+\.[^.]+$/).exec(hostname);

	return Ember.isArray(domain) ? domain[0] : hostname;
}

/**
 * @param {string} url
 * @returns {string}
 */
export function extractDomainFromUrl(url) {
	const domain = (/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i).exec(url)

	return Ember.isArray(domain) ? domain[1] : null;
}
