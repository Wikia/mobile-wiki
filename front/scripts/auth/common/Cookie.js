/**
 * @typedef {Object} CookieAttributes
 * @property {string} [domain]
 * @property {string} [expires]
 * @property {string} [path]
 * @property {boolean} [secure]
 */

/**
 * @class Cookie
 */
export default class Cookie {
	/**
	 * @param {string} name
	 *
	 * @returns {string}
	 */
	static get(name) {
		const cookie = document.cookie;

		if (cookie.length) {
			let cookieStart = cookie.indexOf(`${name}=`),
				cookieEnd;

			if (cookieStart !== -1) {
				cookieStart = cookieStart + name.length + 1;
				cookieEnd = cookie.indexOf(';', cookieStart);
				if (cookieEnd === -1) {
					cookieEnd = cookie.length;
				}
				return decodeURIComponent(cookie.substring(cookieStart, cookieEnd));
			}
		}
		return null;
	}

	/**
	 * @param {string} name
	 * @param {string} value
	 * @param {Object} [attributes={}]
	 *
	 * @returns {object}
	 */
	static set(name, value, attributes = {}) {
		if (typeof attributes.path === 'undefined') {
			attributes.path = '/';
		}

		return (document.cookie = [
			name, '=', value,
			attributes.expires && `; expires=${attributes.expires}`,
			attributes.path && `; path=${attributes.path}`,
			attributes.domain && `; domain=${attributes.domain}`,
			attributes.secure ? '; secure' : ''
		].join(''));
	}
}
