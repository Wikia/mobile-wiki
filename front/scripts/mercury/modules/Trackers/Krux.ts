'use strict';

module Mercury.Modules.Trackers {
	export class Krux {
		private kruxModule: {
			load?: (skinSiteId: string) => void;
		};

		constructor (krux: any) {
			this.kruxModule = krux || {};
		}

		/**
		* @desc Exports page params to Krux.
		* mobileId variable is the ID referencing to the mobile site
		* (see ads_run.js and krux.js in app repository)
		*/
		trackPageView (): void {
			if (typeof this.kruxModule.load === 'function') {
				this.kruxModule.load(M.prop('tracking.krux.mobileId'));
			}
		}
	}
}
