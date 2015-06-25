interface GeoCookie {
	city?: string;
	country?: string;
	continent?: string;
}

class Geo {
	cookieName: string = 'Geo';

	country: string;

	constructor () {
		var geoCookie: GeoCookie = Cookie.get(this.cookieName);
		this.country = geoCookie.country;
	}
}
