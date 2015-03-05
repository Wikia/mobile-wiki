'use strict';

interface Window {
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
		* Boolean variable is Loaded is used to determine if it can load
		* immediately or wait until the window have finished loading (first page load).
		* mobileId variable is the ID referencing to the mobile site
		* (see Krux.run.js in app repository)
		*/
		trackPageView (): void {
			var mobileId = 'JTKzTN3f';
			if (window.Krux.isLoaded) {
				window.Krux.load(mobileId);
			} else {
				window.addEventListener('load', () => {
					window.Krux.load(mobileId);
					window.Krux.isLoaded = true;
				});
			}
		}
	}
}
