/**
 * CookieAttributes
 * @typedef {Object} CookieAttributes
 * @property {string} [domain]
 * @property {string} [expires]
 * @property {string} [path]
 * @property {boolean} [secure]
 */
interface CookieAttributes {
	domain?: string;
	expires?: string;
	path?: string;
	secure?: boolean;
}

/**
 * @class Cookie
 */
class Cookie {

	/**
	 * @param {string} name
	 *
	 * @returns {string}
	 */
	static get (name: string): string {
		var cookie = document.cookie,
			cookieStart: number,
			cookieEnd: number;
		if (cookie.length) {
			cookieStart = cookie.indexOf(name + '=');
			if (cookieStart != -1) {
				cookieStart = cookieStart + name.length + 1;
				cookieEnd = cookie.indexOf(';', cookieStart);
				if (cookieEnd == -1) {
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
	 * @param {Object} attributes
	 *
	 * @returns {object}
	 */
	static set (name: string, value: string, attributes: CookieAttributes = {}): any {
		if (attributes.path === undefined) {
			attributes.path = '/';
		}

		return (document.cookie = [
			name, '=', value,
			attributes.expires && '; expires=' + attributes.expires,
			attributes.path    && '; path=' + attributes.path,
			attributes.domain  && '; domain=' + attributes.domain,
			attributes.secure ? '; secure' : ''
		].join(''));
	}
}
