/// <reference path='../../../../typings/jquery/jquery.d.ts' />
/// <reference path='../../baseline/mercury.d.ts' />
/// <reference path='./Trackers/Krux.ts' />
/// <reference path='./Trackers/UniversalAnalytics.ts' />
/// <reference path='../../baseline/mercury.ts' />
/// <reference path='../utils/load.ts' />

'use strict';

interface Window {
	gaTrackAdEvent: any;
}

module Mercury.Modules {

	export class Ads {
		private static instance: Mercury.Modules.Ads = null;
		private static blocking: boolean = null;
		private adSlots: string[][] = [];
		private adsContext: any = null;
		private adEngineModule: any;
		private adContextModule: any;
		private sourcePointDetectionModule: {
			initDetection(): void;
		};
		private adConfigMobile: any;
		private adLogicPageViewCounterModule: {
			get(): number;
			increment(): number;
		};
		private adMercuryListenerModule: {
			startOnLoadQueue(): void;
		};
		private currentAdsContext: any = null;
		private isLoaded = false;
		private slotsQueue: string[][] = [];

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
		 */
		public init (adsUrl: string): void {
			//Required by ads tracking code
			window.gaTrackAdEvent = this.gaTrackAdEvent;
			// Load the ads code from MW
			M.load(adsUrl, () => {
				if (require) {
					require([
						'ext.wikia.adEngine.adEngine',
						'ext.wikia.adEngine.adContext',
						'ext.wikia.adEngine.config.mobile',
						'ext.wikia.adEngine.adLogicPageViewCounter',
						'ext.wikia.adEngine.sourcePointDetection',
						'ext.wikia.adEngine.mobile.mercuryListener',
						'wikia.krux'
					], (
						adEngineModule: any,
						adContextModule: any,
						adConfigMobile: any,
						adLogicPageViewCounterModule: any,
						sourcePointDetectionModule: any,
						adMercuryListener: any,
						krux: any
					) => {
						this.adEngineModule = adEngineModule;
						this.adContextModule = adContextModule;
						this.sourcePointDetectionModule = sourcePointDetectionModule;
						this.adConfigMobile = adConfigMobile;
						this.adLogicPageViewCounterModule = adLogicPageViewCounterModule;
						this.adMercuryListenerModule = adMercuryListener;
						window.Krux = krux || [];
						this.isLoaded = true;
						this.addDetectionListeners();
						this.reloadWhenReady();
						this.kruxTrackFirstPage();
					});
				} else {
					console.error('Looks like ads asset has not been loaded');
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
				GATracker: Mercury.Modules.Trackers.UniversalAnalytics;
			//Sampling on GA side will kill the performance as we need to allocate object each time we track
			//ToDo: Optimize object allocation for tracking all events
			if (Math.random() * 100 <= adHitSample) {
				GATracker = new Mercury.Modules.Trackers.UniversalAnalytics();
				GATracker.trackAds.apply(GATracker, arguments);
			}
		}

		/**
		 * Function fired when Krux is ready (see init()).
		 * Calls the trackPageView() function on Krux instance.
		 * load() in krux.js (/app) automatically detect that
		 * there is a first page load (needs to load Krux scripts).
		 */
		private kruxTrackFirstPage (): void {
			var KruxTracker = new Mercury.Modules.Trackers.Krux();
			KruxTracker.trackPageView();
		}

		private trackBlocking (value: string): void {
			var dimensions: string[] = [],
				GATracker: Mercury.Modules.Trackers.UniversalAnalytics;
			dimensions[6] = value;
			Mercury.Modules.Trackers.UniversalAnalytics.setDimensions(dimensions);
			GATracker = new Mercury.Modules.Trackers.UniversalAnalytics();
			GATracker.track('ads-sourcepoint-detection', 'impression', value, 0, false);
			this.gaTrackAdEvent.call(this, 'ad/sourcepoint/detection', value, '', 0, false);
			Ads.blocking = value === 'Yes';
		}

		private addDetectionListeners (): void {
			var trackBlocking: Function = this.trackBlocking;
			window.addEventListener('sp.blocking', function (): void {
				trackBlocking('Yes');
			});
			window.addEventListener('sp.not_blocking', function (): void {
				trackBlocking('No');
			});
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
			this.currentAdsContext = adsContext;
			// We need a copy of adSlots as adEngineModule.run destroys it
			this.slotsQueue = this.getSlots();

			if (this.isLoaded && adsContext) {
				this.adContextModule.setContext(adsContext);
				if (Ads.blocking !== null) {
					this.trackBlocking(Ads.blocking ? 'Yes' : 'No');
				} else {
					this.sourcePointDetectionModule.initDetection();
				}
				this.adLogicPageViewCounterModule.increment();
				this.adEngineModule.run(this.adConfigMobile, this.slotsQueue, 'queue.mercury');
			}
		}

		/**
		 * This is callback that is run after script is loaded
		 */
		public reloadWhenReady (): void {
			this.reload(this.currentAdsContext);
			this.onLoad();
		}

		private onLoad (): void {
			this.adMercuryListenerModule.startOnLoadQueue();
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
		 * Push slot to the current queue (refresh ad in given slot)
		 *
		 * @param name name of the slot
		 */
		public pushSlotToQueue (name: string): void {
			this.slotsQueue.push([name]);
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
		 * This method is being overwritten in ApplicationRoute for ads needs.
		 * To learn more check ApplicationRoute.ts file.
		 */
		public createLightbox (contents: any, lightboxVisible?: boolean): void {
		}

		/**
		 * This method is being overwritten in ApplicationRoute for ads needs.
		 * To learn more check ApplicationRoute.ts file.
		 */
		public showLightbox (): void {
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
