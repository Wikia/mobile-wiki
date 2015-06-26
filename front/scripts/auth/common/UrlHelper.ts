class UrlHelper {
	public urlEncode(object: Object): string {
		return Object.keys(object).map((key: string): string =>
			`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
		).join('&');
	}

	public urlDecode(input: string): Object {
		var queryDict = {};
		input.split("&").forEach(
			(item: string): void => {
				queryDict[decodeURIComponent(item.split("=")[0])] = decodeURIComponent(item.split("=")[1]);
			}
		);
		return queryDict;
	}
}
