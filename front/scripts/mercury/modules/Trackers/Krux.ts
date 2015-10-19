'use strict';

interface Window {
	Krux: {
		load?: (skinSiteId: string) => void;
	};
}

module Mercury.Modules.Trackers {
	export class Krux {
		/**
		 * @returns {void}
		 */
		constructor () {
			window.Krux = window.Krux || [];
		}

		/**
		 * Exports page params to Krux.
		 *
		 * mobileId variable is the ID referencing to the mobile site
		 * (see ads_run.js and krux.js in app repository)
		 *
		 * @returns {void}
		 */
		trackPageView (): void {
			if (typeof window.Krux.load === 'function') {
				window.Krux.load(M.prop('tracking.krux.mobileId'));
			}
		}
	}
}
