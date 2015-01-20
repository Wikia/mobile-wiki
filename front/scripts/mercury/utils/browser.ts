/// <reference path="../../baseline/mercury.d.ts" />

/**
 * @define browser
 */
'use strict';

module Mercury.Utils.Browser {
	/**
	 * Detects if user is using iOS or Android system
	 * @return {string}
	 */
	export function getSystem (): string {
		var ua: string = Em.get(window, 'navigator.userAgent'),
			system: string;

		if (ua.match(/iPad|iPhone|iPod/i) !== null) {
			system = 'ios';
		} else if (ua.match(/Android/i) !== null) {
			system = 'android';
		}
		return system;
	}
}
