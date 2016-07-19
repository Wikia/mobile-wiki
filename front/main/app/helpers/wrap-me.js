import Ember from 'ember';

/**
 * Helper to generate HTML from passed string and additional options.
 * By default the passed string is HTML escaped before being wrapped in
 * the given tags. If the content has already been sanitised, you can pass
 * the option allowRawHTML is true to prevent it being escaped.
 * By default, if no tagName specified, wraps passed string in <span> tags.
 * Useful ie. when we need to style differently elements of the same string.
 * Options:
 * - tagName - override default span tag name
 * - className - class name to be added to wrapping tag
 * - allowRawHTML - don't escape the passed string if it has already been sanitised
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
	let content = params[0] || '',
		tagName = 'span',
		className = '';

	if (!options.allowRawHTML) {
		content = Handlebars.Utils.escapeExpression(content);
	}

	if (options.tagName) {
		tagName = options.tagName;
	}

	if (options.className) {
		className = ` class="${options.className}"`;
	}

	return new Handlebars.SafeString(`<${tagName}${className}>${content}</${tagName}>`).toHTML();
});
