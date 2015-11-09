/**
 * @typedef {Object} GeoCookie
 * @property {string} [city]
 * @property {string} [country]
 * @property {string} [continent]
 */

import {Cookie} from '../common/Cookie';

/**
 * @class Geo
 *
 * @property {string} cookieName
 * @property {string} country
 * @property {string} continent
 */
export class Geo {
	/**
	 * @returns {void}
	 */
	constructor() {
		this.cookieName = 'Geo';

		const geoCookie = Cookie.get(this.cookieName);

		let parsedGeoCookie;

		try {
			parsedGeoCookie = JSON.parse(geoCookie);
		} catch (e) {
			parsedGeoCookie = null;
		}

		// Cookie can be either parsed incorrectly or set to null
		if (!parsedGeoCookie) {
			parsedGeoCookie = {};
		}

		this.country = parsedGeoCookie.country;
		this.continent = parsedGeoCookie.continent;
	}

	/**
	 * @returns {string}
	 */
	getCountry() {
		return this.country;
	}

	/**
	 * @returns {string}
	 */
	getContinent() {
		return this.continent;
	}
}
