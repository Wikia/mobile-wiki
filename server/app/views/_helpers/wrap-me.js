import {escapeHtml} from 'hoek';

/**
 * Helper to generate HTML from passed string and additional options.
 * By default, if no tagName specified, wraps passed string in <span> tags.
 * Useful ie. when we need to style differently elements of the same string.
 * Options:
 * - tagName - override default div tag name
 * - href - add a href attribute for <a> tag
 * - className - class name to be added to wrapping tag
 *
 * @example
 * {{{i18n 'main.search-error-not-found'
 * 	ns='search'
 * 	query=(wrap-me erroneousQuery className='search-error-not-found__query' tagName='span')
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
		className = '',
		trackingLabel = '';

	if (hash.tagName) {
		tagName = escapeHtml(hash.tagName);
	}

	if (hash.tagName === 'a' && hash.href) {
		href = ` href="${escapeHtml(hash.href)}"`;
	}

	if (hash.className) {
		className = ` class="${escapeHtml(options.className)}"`;
	}

	if (hash.trackingLabel) {
		trackingLabel = ` data-tracking-label="${escapeHtml(hash.trackingLabel)}"`;
	}

	return `<${tagName}${href}${className}${trackingLabel}>${content}</${tagName}>`;
};
