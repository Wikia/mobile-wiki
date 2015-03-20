/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../baseline/mercury.d.ts" />

'use strict';

module Mercury.Modules {

	export class InstantGlobals {
		private static instance: Mercury.Modules.InstantGlobals = null;

		/**
		 * Returns instance of InstantGlobals object
		 * @returns {Mercury.Modules.InstantGlobals}
		 */
		public static getInstance (): Mercury.Modules.InstantGlobals {
			if (InstantGlobals.instance === null) {
				InstantGlobals.instance = new Mercury.Modules.InstantGlobals();
			}
			return InstantGlobals.instance;
		}
		/**
		 * Initializes the InstantGlobals module
		 */
		public init (article: any) {
			var adsInstance: Mercury.Modules.Ads;
			M.load(M.prop('resourcesUrl'), () => {
				if (!Wikia.InstantGlobals.wgSitewideDisableAdsOnMercury) {
					adsInstance = Mercury.Modules.Ads.getInstance();
					adsInstance.init((): void => {
						adsInstance.reload(article.adsContext);
					});
				}
			});
		}
	}
}
