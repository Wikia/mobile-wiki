/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../baseline/mercury.d.ts" />

'use strict';

interface Window {
	gaTrackAdEvent: any
}

module Mercury.Modules {

	export class Ads {
		private static instance: Mercury.Modules.Ads = null;
		private adSlots: string[][] = [];
		private adsContext: any = null;
		private adEngineModule: any;
		private adContextModule: any;
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
			//Required by ads tracking code
			window.gaTrackAdEvent = this.gaTrackAdEvent;
			// Load the ads code from MW
			M.load(adsUrl, () => {
				require([
					'ext.wikia.adEngine.adEngine',
					'ext.wikia.adEngine.adContext',
					'ext.wikia.adEngine.adConfigMobile'
				], (adEngineModule: any, adContextModule: any, adConfigMobile: any) => {
					this.adEngineModule = adEngineModule;
					this.adContextModule = adContextModule;
					this.adConfigMobile = adConfigMobile;
					this.isLoaded = true;
					callback.call(this);
				});
			});
		}

		/**
		 * Method for sampling and pushing ads-related events
		 * @arguments coming from ads tracking request
		 */
		public gaTrackAdEvent(): void {
			var args: any,
				adHitSample: number = 1, //1%
				GATracker: Mercury.Modules.Trackers.GoogleAnalytics;
			//Sampling on GA side will kill the performance as we need to allocate object each time we track
			//ToDo: Optimize object allocation for tracking all events
			if ( Math.random() * 100 <= adHitSample ) {
				args = Array.prototype.slice.call( arguments );
				args.unshift('ads._trackEvent');
				GATracker = new Mercury.Modules.Trackers.GoogleAnalytics();
				GATracker.trackAds.apply(GATracker, args);
			}
		}

		private setContext(adsContext: any) {
			this.adsContext = adsContext ? adsContext : null;
		}

		/**
		 * Reloads the ads with the provided adsContext
		 * @param adsContext
		 */
		public reload (adsContext: any) {
			// Store the context for external reuse
			this.setContext(adsContext);
			if (this.isLoaded && adsContext) {
				this.adContextModule.setContext(adsContext);
				// We need a copy of adSlots as .run destroys it
				this.adEngineModule.run(this.adConfigMobile, this.getSlots(), 'queue.mobile');
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

		/**
		 * Retrieves the ads context
		 *
		 * @returns {Object|null}
		 */
		getContext (): any {
			return this.adsContext;
		}
	}
}
