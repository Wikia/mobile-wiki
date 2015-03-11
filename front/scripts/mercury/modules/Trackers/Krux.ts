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
		length?: any;
		load?: (skinSiteId: string) => void;
	};
}

module Mercury.Modules.Trackers {
	export class Krux {

		constructor () {
			window.Krux = window.Krux || [];
		}

		/**
		* @desc Loads Krux.js code which sends tracking data to Krux.
		* Boolean variable isLoaded is used to determine if it can load
		* immediately or wait until the window have finished loading (first page load).
		* mobileId variable is the ID referencing to the mobile site
		* (see Krux.run.js in app repository)
		* loadKrux() is used to to prevent
		* error when Krux has not been received.
		*/
		trackPageView (): void {
			if (window.Krux.isLoaded) {
				this.loadKrux();
			} else {
				$(window).load(() => {
					this.loadKrux();
				});
			}
		}

		loadKrux (): void {
			if (typeof window.Krux.load === 'function') {
				window.Krux.load(M.prop('tracking.krux.mobileId'));
				window.Krux.isLoaded = true;
			}
		}
	}
}
