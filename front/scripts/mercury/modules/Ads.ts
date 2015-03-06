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
		private adLogicPageViewCounterModule: {
			get (): number;
			increment (): number;
		};
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
		public init (adsUrl: string, callback: () => void): void {
			//Required by ads tracking code
			window.gaTrackAdEvent = this.gaTrackAdEvent;
			// Load the ads code from MW
			M.load(adsUrl, () => {
				if (require) {
					require([
						'ext.wikia.adEngine.adEngine',
						'ext.wikia.adEngine.adContext',
						'ext.wikia.adEngine.adConfigMobile',
						'ext.wikia.adEngine.adLogicPageViewCounter'
					], (
						adEngineModule: any,
						adContextModule: any,
						adConfigMobile: any,
						adLogicPageViewCounterModule: any
					) => {
						this.adEngineModule = adEngineModule;
						this.adContextModule = adContextModule;
						this.adConfigMobile = adConfigMobile;
						this.adLogicPageViewCounterModule = adLogicPageViewCounterModule;
						this.isLoaded = true;
						callback.call(this);
					});
				} else {
					Em.Logger.error('Looks like ads asset has not been loaded');
				}
			});
		}

		/**
		 * Method for sampling and pushing ads-related events
		 * @arguments coming from ads tracking request
		 * It's called by track() method in wikia.tracker fetched from app by ads code
		 */
		public gaTrackAdEvent (): void {
			var adHitSample: number = 1, //Percentage of all the track requests to go through
				GATracker: Mercury.Modules.Trackers.GoogleAnalytics;
			//Sampling on GA side will kill the performance as we need to allocate object each time we track
			//ToDo: Optimize object allocation for tracking all events
			if (Math.random() * 100 <= adHitSample) {
				GATracker = new Mercury.Modules.Trackers.GoogleAnalytics();
				GATracker.trackAds.apply(GATracker, arguments);
			}
		}

		private setContext (adsContext: any): void {
			this.adsContext = adsContext ? adsContext : null;
		}

		/**
		 * Reloads the ads with the provided adsContext
		 * @param adsContext
		 */
		public reload (adsContext: any): void {
			// Store the context for external reuse
			this.setContext(adsContext);

			if (this.isLoaded && adsContext) {
				this.adContextModule.setContext(adsContext);
				this.adLogicPageViewCounterModule.increment();
				// We need a copy of adSlots as .run destroys it
				this.adEngineModule.run(this.adConfigMobile, this.getSlots(), 'queue.mercury');
			}
		}

		/**
		 * Returns copy of adSlots
		 *
		 * @returns {string[][]}
		 */
		getSlots (): string[][] {
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
