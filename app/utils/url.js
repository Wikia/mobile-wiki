/**
 * Converting and escaping Querystring object to string.
 *
 * @param {Object} [query={}] Querystring object
 * @param {getQueryStringOptions} options
 * @returns {string}
 */
export function getQueryString(query = {}, { useBrackets = true, skipQuestionMark = false } = {}) {
	const queryArray = Object.keys(query);
	const brackets = useBrackets ? '[]' : '';

	let queryString = '';

	if (queryArray.length > 0) {
		const start = skipQuestionMark ? '' : '?';

		queryString = `${start}${queryArray.map((key) => {
			if (query[key] instanceof Array) {
				if (query[key].length) {
					return query[key]
						.map((item) => `${encodeURIComponent(key)}${brackets}=${encodeURIComponent(item)}`)
						.join('&');
				}
			} else {
				return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
			}
		}).join('&')}`;
	}

	return queryString;
}

/**
 * @param {EventTarget} target
 * @returns {Boolean}
 */
export function isHashLink(target) {
	// We need to use getAttribute because target.href returns whole resolved URL instead of the original value
	return target.hasAttribute('href') && target.getAttribute('href').indexOf('#') === 0;
}
