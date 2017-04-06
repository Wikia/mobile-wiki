/**
 * We need to support links like:
 * /wiki/Rachel Berry
 * /wiki/Rachel  Berry
 * /wiki/Rachel__Berry
 *
 * but we want them to be displayed normalized in URL bar
 */

/**
 * @param {string} [title='']
 * @returns {string}
 */
export function normalizeToUnderscore(title = '') {
	return title
		.replace(/\s/g, '_')
		.replace(/_+/g, '_');
}

/**
 * @param {string} [str='']
 * @returns {string}
 */
export function normalizeToWhitespace(str = '') {
	return str
		.replace(/_/g, ' ')
		.replace(/\s+/g, ' ');
}

/**
 * Get last url from input text
 * @param {string} text
 * @returns {string}
 */
export function getLastUrlFromText(text) {
	let urls;

	urls = text.match(/(https?:\/\/[^\s]+)/ig);

	if (!urls) {
		return null;
	}

	return urls.pop();
}

/**
 * @param  {string} text
 * @return {string}
 */
export function escapeRegex(text) {
	return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
