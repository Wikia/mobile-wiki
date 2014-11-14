/// <reference path="../../baseline/mercury.d.ts" />

/**
 * @define os
 */
'use strict';

module Mercury.Utils.OS {
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
