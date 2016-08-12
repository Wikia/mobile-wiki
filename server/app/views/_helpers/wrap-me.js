import {escapeHtml} from 'hoek';

/**
 * Helper to generate HTML from passed string and additional options.
 * By default, if no tagName specified, wraps passed string in <span> tags.
 * Useful ie. when we need to style differently elements of the same string.
 * Options:
 * - tagName - override default div tag name
 * - href - add a href attribute for <a> tag
 * - trackingLabel - add a data attribute data-tracking-label
 *
 * @example
 * {{{i18n 'main.search-error-not-found'
 * 	ns='search'
 * 	query=(wrap-me erroneousQuery tagName='span')
 * }}}
 *
 * @param {*} param
 * @param {Object} options
 * @returns {string}
 */

module.exports = function (param, options) {
	const content = escapeHtml(param) || '',
		hash = options.hash || {};

	let tagName = 'span',
		href = '',
		trackingLabel = '';

	if (hash.tagName) {
		tagName = escapeHtml(hash.tagName);
	}

	if (hash.tagName === 'a' && hash.href) {
		href = ` href="${escapeHtml(hash.href)}"`;
	}

	if (hash.trackingLabel) {
		trackingLabel = ` data-tracking-label="${escapeHtml(hash.trackingLabel)}"`;
	}

	return `<${tagName}${href}${trackingLabel}>${content}</${tagName}>`;
};
