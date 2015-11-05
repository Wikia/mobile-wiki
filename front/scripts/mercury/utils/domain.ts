/// <reference path="../../baseline/mercury.d.ts" />

module Mercury.Utils {
	/**
	 * @param {string} [hostname=window.location.hostname]
	 * @returns {string}
	 */
	export function getDomain(hostname: string = window.location.hostname): string {
		var domain = /[^.]+\.[^.]+$/.exec(hostname);
		return Em.isArray(domain) ? domain[0] : hostname;
	}
}
