interface GeoCookie {
	city?: string;
	country?: string;
	continent?: string;
}

class Geo {
	cookieName: string = 'Geo';

	country: string;

	constructor () {
		var geoCookie: string = Cookie.get(this.cookieName),
			parsedGeoCookie: GeoCookie;
		try {
			parsedGeoCookie = JSON.parse(geoCookie);
		} catch (e) {
			parsedGeoCookie = {};
		}
		this.country = parsedGeoCookie.country;
	}

	public getCountry (): string {
		return this.country;
	}
}
