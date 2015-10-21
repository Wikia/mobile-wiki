/**
 * GeoCookie
 * @typedef {Object} GeoCookie
 * @property {string} [city]
 * @property {string} [country]
 * @property {string} [continent]
 */
interface GeoCookie {
	city?: string;
	country?: string;
	continent?: string;
}

/**
 * @class Geo
 */
class Geo {
	cookieName: string = 'Geo';

	country: string;
	continent: string;

	/**
	 * @constructs Geo
	 */
	constructor () {
		var geoCookie: string = Cookie.get(this.cookieName),
			parsedGeoCookie: GeoCookie;
		try {
			parsedGeoCookie = JSON.parse(geoCookie);
		} catch (e) {
			parsedGeoCookie = null;
		}

		//Cookie can be either parsed incorrectly or set to null
		if (!parsedGeoCookie) {
			parsedGeoCookie = {};
		}

		this.country = parsedGeoCookie.country;
		this.continent = parsedGeoCookie.continent;
	}

	/**
	 * @returns {string}
	 */
	public getCountry (): string {
		return this.country;
	}

	/**
	 * @returns {string}
	 */public getContinent (): string {
		return this.continent;
	}
}
