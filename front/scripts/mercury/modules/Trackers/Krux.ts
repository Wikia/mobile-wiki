/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	Krux: any[];
}

module Mercury.Modules.Trackers {
	export class Krux {
		constructor () {
			console.log('window.Krux', window.Krux)
			window.Krux = window.Krux || [];
		}

		trackPageView (): void {
			var siteId = 'JTKzTN3f';
			window.addEventListener('load', function () {
				console.log('Loading Krux code, site id: ' + siteId, 'debug', 'Krux.run.js');
				window.Krux.load(siteId);
			});
		}
	}
}