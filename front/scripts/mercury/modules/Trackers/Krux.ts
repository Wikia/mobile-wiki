/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	Krux: {
		isLoaded?: boolean;
		load?: (siteId: string) => void;
	};
}

module Mercury.Modules.Trackers {
	export class Krux {

		constructor () {
			window.Krux = window.Krux || [];
		}

		trackPageView (): void {
			var siteId = 'JTKzTN3f';
			//console.log('window.Krux', window.Krux)
			if (window.Krux.isLoaded) {
				console.log('Loading Krux code, site id: ' + siteId, 'debug', 'Krux.run.js');
				window.Krux.load(siteId);
			} else {
				window.addEventListener('load', () => {
					console.log('Loading Krux code, site id: ' + siteId, 'debug', 'Krux.run.js');
					window.Krux.load(siteId);
					window.Krux.isLoaded = true;
				});
			}
		}
	}
}
