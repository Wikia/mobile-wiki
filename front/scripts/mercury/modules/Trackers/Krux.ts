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
		* @desc Loads Krux.js code which sends tracking data to Krux.
		* Boolean variable isLoaded is used to determine if it can load
		* immediately or wait until the window have finished loading (first page load).
		* mobileId variable is the ID referencing to the mobile site
		* (see Krux.run.js in app repository)
		* Krux.load() is wrapped in the try...catch statement to prevent
		* error when Krux has not been received.
		*/
		trackPageView (): void {
			if (window.Krux.isLoaded) {
				window.Krux.load(Mercury.tracking.krux.mobileId);
			} else {
				$(window).load(() => {
					try {
						window.Krux.load(Mercury.tracking.krux.mobileId);
					} catch (err) {
						console.log("Krux is not set!");
						return;
					}
					window.Krux.isLoaded = true;
				});
			}
		}
	}
}
