'use strict';

interface Window {
	Krux: {
		load?: (skinSiteId: string) => void;
	};
}

module Mercury.Modules.Trackers {
	export class Krux {

		constructor () {
			window.Krux = window.Krux || [];
		}

		/**
		* @desc Exports page params to Krux.
		* mobileId variable is the ID referencing to the mobile site
		* (see ads_run.js and krux.js in app repository)
		*/
		trackPageView (): void {
			if (typeof window.Krux.load === 'function') {
				window.Krux.load(M.prop('tracking.krux.mobileId'));
			}
		}
	}
}
