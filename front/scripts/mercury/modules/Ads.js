/* eslint no-console: 0 */

import Krux from './Trackers/Krux';
import UniversalAnalytics from './Trackers/UniversalAnalytics';
import load from '../utils/load';

/**
 * @typedef {Object} SourcePointDetectionModule
 * @property {Function} initDetection
 */

/**
 * @typedef {Object} AdLogicPageViewCounterModule
 * @property {Function} get
 * @property {Function} increment
 */

/**
 * @typedef {Object} AdMercuryListenerModule
 * @property {Function} startOnLoadQueue
 */

/**
 * @class Ads
 *
 * @property {Ads} instance
 * @property {boolean|null} blocking
 * @property {Array<string[]>} adSlots
 * @property {Object} adsContext
 * @property {*} adEngineModule
 * @property {*} adContextModule
 * @property {SourcePointDetectionModule} sourcePointDetectionModule
 * @property {*} adConfigMobile
 * @property {AdLogicPageViewCounterModule} adLogicPageViewCounterModule
 * @property {AdMercuryListenerModule} adMercuryListenerModule
 * @property {Krux} kruxTracker
 * @property {Object} currentAdsContext
 * @property {boolean} isLoaded
 * @property {Array<string[]>} slotsQueue
 */
class Ads {
	constructor() {
		this.adSlots = [];
		this.adsContext = null;
		this.currentAdsContext = null;
		this.isLoaded = false;
		this.kruxTracker = null;
		this.slotsQueue = [];
	}

	/**
	 * Returns instance of Ads object
	 *
	 * @returns {Ads}
	 */
	static getInstance() {
		if (Ads.instance === null) {
			Ads.instance = new Ads();
		}
		return Ads.instance;
	}

	/**
	 * Initializes the Ad module
	 *
	 * @param {string} adsUrl - Url for the ads script
	 * @returns {void}
	 */
	init(adsUrl) {
		// Required by ads tracking code
		window.gaTrackAdEvent = Ads.gaTrackAdEvent;

		/* global require */

		// Load the ads code from MW
		load(adsUrl, () => {
			if (require) {
				require([
					'ext.wikia.adEngine.adEngine',
					'ext.wikia.adEngine.adContext',
					'ext.wikia.adEngine.config.mobile',
					'ext.wikia.adEngine.adLogicPageViewCounter',
					'ext.wikia.adEngine.sourcePointDetection',
					'ext.wikia.adEngine.mobile.mercuryListener',
					'wikia.krux'
				], (adEngineModule,
					adContextModule,
					adConfigMobile,
					adLogicPageViewCounterModule,
					sourcePointDetectionModule,
					adMercuryListener,
					krux) => {
					this.adEngineModule = adEngineModule;
					this.adContextModule = adContextModule;
					this.sourcePointDetectionModule = sourcePointDetectionModule;
					this.adConfigMobile = adConfigMobile;
					this.adLogicPageViewCounterModule = adLogicPageViewCounterModule;
					this.adMercuryListenerModule = adMercuryListener;
					this.kruxTracker = new Krux(krux);
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
	 *
	 * @returns {void}
	 */
	static gaTrackAdEvent() {
		// Percentage of all the track requests to go through
		const adHitSample = 1;

		// Sampling on GA side will kill the performance as we need to allocate object each time we track
		// ToDo: Optimize object allocation for tracking all events
		if (Math.random() * 100 <= adHitSample) {
			const GATracker = new UniversalAnalytics();

			GATracker.trackAds.apply(GATracker, arguments);
		}
	}

	/**
	 * Function fired when this.kruxTracker is ready (see init()).
	 * Calls the trackPageView() function on krux tracker.
	 * load() in krux.js (/app) automatically detect that
	 * there is a first page load (needs to load Krux scripts).
	 *
	 * @returns {void}
	 */
	kruxTrackFirstPage() {
		this.kruxTracker.trackPageView();
	}

	/**
	 * @param {string} value
	 * @returns {void}
	 */
	trackBlocking(value) {
		const dimensions = [];

		let GATracker;

		dimensions[6] = value;
		UniversalAnalytics.setDimensions(dimensions);

		GATracker = new UniversalAnalytics();

		GATracker.track('ads-sourcepoint-detection', 'impression', value, 0, false);
		Ads.gaTrackAdEvent.call(this, 'ad/sourcepoint/detection', value, '', 0, false);

		Ads.blocking = value === 'Yes';
	}

	/**
	 * @returns {void}
	 */
	addDetectionListeners() {
		const trackBlocking = this.trackBlocking;

		window.addEventListener('sp.blocking', () => {
			trackBlocking('Yes');
		});

		window.addEventListener('sp.not_blocking', () => {
			trackBlocking('No');
		});
	}

	/**
	 * @param {*} adsContext
	 * @returns {void}
	 */
	setContext(adsContext) {
		this.adsContext = adsContext ? adsContext : null;
	}

	/**
	 * Turns off all ads for logged in user
	 *
	 * @param {*} adsContext
	 * @returns {void}
	 */
	turnOffAdsForLoggedInUsers(adsContext) {
		if (M.prop('userId')) {
			adsContext.opts = adsContext.opts || {};
			adsContext.opts.showAds = false;
			adsContext.opts.pageType = 'no_ads';
		}
	}

	/**
	 * Reloads the ads with the provided adsContext
	 *
	 * @param {*} adsContext
	 * @returns {void}
	 */
	reload(adsContext) {
		this.turnOffAdsForLoggedInUsers(adsContext);
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
	 *
	 * @returns {void}
	 */
	reloadWhenReady() {
		this.reload(this.currentAdsContext);
		this.onLoad();
	}

	/**
	 * @returns {void}
	 */
	onLoad() {
		this.adMercuryListenerModule.startOnLoadQueue();
	}

	/**
	 * Returns copy of adSlots
	 *
	 * @returns {*}
	 */
	getSlots() {
		return $.extend([], this.adSlots);
	}

	/**
	 * Push slot to the current queue (refresh ad in given slot)
	 *
	 * @param {string} name - name of the slot
	 * @returns {void}
	 */
	pushSlotToQueue(name) {
		this.slotsQueue.push([name]);
	}

	/**
	 * Adds ad slot
	 *
	 * @param {string} name - name of the slot
	 * @returns {number} index of the inserted slot
	 */
	addSlot(name) {
		return this.adSlots.push([name]);
	}

	/**
	 * Removes ad slot by name
	 *
	 * @param {string} name - Name of ths slot to remove
	 * @returns {void}
	 */
	removeSlot(name) {
		this.adSlots = $.grep(this.adSlots, (slot) => {
			return slot[0] && slot[0] === name;
		}, true);
	}

	/**
	 * This method is being overwritten in ApplicationRoute for ads needs.
	 * To learn more check ApplicationRoute.ts file.
	 *
	 * @returns {void}
	 */
	createLightbox() {
	}

	/**
	 * This method is being overwritten in ApplicationRoute for ads needs.
	 * To learn more check ApplicationRoute.ts file.
	 *
	 * @returns {void}
	 */
	showLightbox() {
	}

	/**
	 * Retrieves the ads context
	 *
	 * @returns {Object|null}
	 */
	getContext() {
		return this.adsContext;
	}
}

Ads.instance = null;
Ads.blocking = null;

// @TODO XW-703 right now ads code which comes from MW is expecting window.Mercury.Modules.
// When introducing sync require in ads this should be fixed
window.Mercury = window.Mercury || {};
window.Mercury.Modules = window.Mercury.Modules || {};
window.Mercury.Modules.Ads = Ads;

export default Ads;
