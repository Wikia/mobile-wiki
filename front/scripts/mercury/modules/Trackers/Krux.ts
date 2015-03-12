'use strict';

interface Window {
	/**
	* isLoaded variable is set on window element not on the
	* class because Krux here is only the 'facade' of the real
	* Krux class and is created on each page load. Assigning
	* isLoaded to windows allows to keep track on it also
	* on the consecutive pages.
	*/
	Krux: {
		isLoaded?: boolean;
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
