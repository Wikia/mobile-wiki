/// <reference path="../../baseline/mercury.d.ts" />

module Mercury.Utils {
	/**
	 * @param {string} hostname
	 * @returns {string}
	 */
	export function getDomain(hostname: string = window.location.hostname): string {
		return /[^.]+\.[^.]+$/.exec(hostname)[0];
	}
}
