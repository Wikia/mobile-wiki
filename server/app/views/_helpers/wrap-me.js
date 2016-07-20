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
	const content = param || '',
		hash = options.hash || {};

	let tagName = 'span',
		href = '',
		className = '';

	if (hash.tagName) {
		tagName = hash.tagName;
	}

	if (hash.tagName === 'a' && hash.href) {
		href = ` href="${hash.href}"`;
	}

	if (hash.className) {
		className = ` class="${options.className}"`;
	}

	return `<${tagName}${href}${className}>${content}</${tagName}>`;
};
