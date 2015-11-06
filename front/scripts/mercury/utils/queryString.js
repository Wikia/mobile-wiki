/// <reference path="../../baseline/mercury.d.ts" />

module Mercury.Utils {
	/**
	 * @param {string} name
	 * @returns {string}
	 */
	export function getQueryParam(name: string): string {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
}
