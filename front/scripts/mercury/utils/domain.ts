/// <reference path="../../baseline/mercury.d.ts" />

module Mercury.Utils {
	/**
	 * @returns {string}
	 */
	export function getDomain(): string {
		return /[^.]+\.[^.]+$/.exec(window.location.hostname)[0];
	}
}
