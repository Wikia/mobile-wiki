class UrlHelper {
	public urlEncode(object: Object): string {
		return Object.keys(object).map((key: string): string =>
			`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
		).join('&');
	}
}
