class Cookie {
	static get (cookieName: string): string {
		var cookie = document.cookie,
			cookieStart: number,
			cookieEnd: number;
		if (cookie.length) {
			cookieStart = cookie.indexOf(cookieName + '=');
			if (cookieStart != -1) {
				cookieStart = cookieStart + cookieName.length + 1;
				cookieEnd = cookie.indexOf(';', cookieStart);
				if (cookieEnd == -1) {
					cookieEnd = cookie.length;
				}
				return decodeURIComponent(cookie.substring(cookieStart, cookieEnd));
			}
		}
		return null;
	}
}
