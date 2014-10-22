'use strict';

module Wikia.Modules {

	export class Ads {

		private adEngine: any;
		private adContext: any;
		private adConfigMobile: any;
		private isLoaded = false;

		constructor (adsContext: any, adSlots: any) {
			if (Wikia.ads.url) {
				W.load(Wikia.ads.url, () => {
					require([
						'ext.wikia.adEngine.adEngine',
						'ext.wikia.adEngine.adContext',
						'ext.wikia.adEngine.adConfigMobile'
					], (adEngine, adContext, adConfigMobile) => {
						this.adEngine = adEngine;
						this.adContext = adContext;
						this.adConfigMobile = adConfigMobile;
						this.isLoaded = true;
						this.reloadAds(adContext, adSlots);
					});
				});
			}
		}

		public reloadAds (adsContext: any, adSlots: any) {
			this.adContext.setContext(adsContext);
			// We need a copy of Wikia.ads.slots as .run destroys it
			this.adEngine.run(this.adConfigMobile, $.extend([], adSlots), 'queue.mobile');
		}
	}
}
