import Ember from 'ember';

/**
 * Helper to generate HTML from passed string and additional options.
 * By default, if no tagName specified, wraps passed string in <div> tags.
 * Useful ie. when we need to style differently elements of the same string.
 * Options:
 * - tagName - override default div tag name
 * - className - class name to be added to wrapping tag
 *
 * @example
 * {{{i18n 'main.search-error-not-found'
 * 	ns='search'
 * 	query=(wrap-me erroneousQuery className='search-error-not-found__query' tagName='span')
 * }}}
 *
 * @param {Array} params
 * @param {Object} options
 * @returns {string}
 */

const {Handlebars, Helper} = Ember;

export default Helper.helper((params, options) => {
	const name = params[0];
	let tagName = 'div',
		className = '';

	if (options.tagName) {
		tagName = options.tagName;
	}

	if (options.className) {
		className = ` class="${options.className}"`;
	}

	return new Handlebars.SafeString(`<${tagName}${className}>${name}</${tagName}>`).toHTML();
});
