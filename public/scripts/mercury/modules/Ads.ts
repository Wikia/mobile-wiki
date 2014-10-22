/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../baseline/mercury.d.ts" />

'use strict';

module Mercury.Modules {

	export class Ads {
		private static instance: Mercury.Modules.Ads = null;
		private adSlots: string[][] = [];
		private adEngine: any;
		private adContext: any;
		private adConfigMobile: any;
		private isLoaded = false;

		/**
		 * Returns instance of Ads object
		 * @returns {Mercury.Modules.Ads}
		 */
		public static getInstance (): Mercury.Modules.Ads {
			if (Ads.instance === null) {
				Ads.instance = new Mercury.Modules.Ads();
			}
			return Ads.instance;
		}

		/**
		 * Initializes the Ad module
		 *
		 * @param adsUrl Url for the ads script
		 * @param callback Callback function to exwecute when the script is loaded
		 */
		public init (adsUrl: string, callback: () => void) {
			// Load the ads code from MW
			M.load(adsUrl, () => {
				require([
					'ext.wikia.adEngine.adEngine',
					'ext.wikia.adEngine.adContext',
					'ext.wikia.adEngine.adConfigMobile'
				], (adEngine: any, adContext: any, adConfigMobile: any) => {
					this.adEngine = adEngine;
					this.adContext = adContext;
					this.adConfigMobile = adConfigMobile;
					this.isLoaded = true;
					callback.call(this);
				});
			});
		}

		/**
		 * Reloads the ads with the provided adsContext
		 * @param adsContext
		 */
		public reload (adsContext: any) {
			if (this.isLoaded) {
				this.adContext.setContext(adsContext);
				// We need a copy of adSlots as .run destroys it
				this.adEngine.run(this.adConfigMobile, this.getSlots(), 'queue.mobile');
			}
		}

		/**
		 * Returns copy of adSlots
		 *
		 * @returns {string[][]}
		 */
		getSlots(): string[][] {
			return <string[][]>$.extend([], this.adSlots);
		}

		/**
		 * Adds ad slot
		 *
		 * @param name name of the slot
		 * @returns {number} index of the inserted slot
		 */
		public addSlot (name: string): number {
			return this.adSlots.push([name]);
		}

		/**
		 * Removes ad slot by name
		 *
		 * @param name Name of ths slot to remove
		 */
		public removeSlot (name:string): void {
			this.adSlots = $.grep(this.adSlots, (slot) => {
				return slot[0] && slot[0] === name;
			}, true);
		}
	}
}
