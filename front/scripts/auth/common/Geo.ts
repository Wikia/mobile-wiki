interface GeoCookie {
	city?: string;
	country?: string;
	continent?: string;
}

class Geo {
	cookieName: string = 'Geo';

	country: string;
	continent: string;

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

	public getCountry (): string {
		return this.country;
	}

	public getContinent (): string {
		return this.continent;
	}
}
