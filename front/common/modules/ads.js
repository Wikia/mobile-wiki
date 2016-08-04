/* eslint no-console: 0 */

import load from '../utils/load';

/**
 * @typedef {Object} SourcePointDetectionModule
 * @property {Function} initDetection
 */

/**
 * @typedef {Object} AdSlot
 * @property {string} name
 * @property {Function} onSuccess
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
 * @property {*} adEngineRunnerModule
 * @property {*} adContextModule
 * @property {SourcePointDetectionModule} sourcePointDetectionModule
 * @property {*} adConfigMobile
 * @property {AdLogicPageViewCounterModule} adLogicPageViewCounterModule
 * @property {AdMercuryListenerModule} adMercuryListenerModule
 * @property {Krux} krux
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
		this.krux = null;
		this.slotsQueue = [];
		this.uapResult = false;
		this.uapCalled = false;
		this.uapCallbacks = [];
		this.noUapCallbacks = [];
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

		// Load the ads code from MW
		load(adsUrl, () => {
			if (window.require) {
				window.require([
					'ext.wikia.adEngine.adContext',
					'ext.wikia.adEngine.adEngineRunner',
					'ext.wikia.adEngine.adLogicPageViewCounter',
					'ext.wikia.adEngine.config.mobile',
					'ext.wikia.adEngine.mobile.mercuryListener',
					'ext.wikia.adEngine.sourcePointDetection',
					'wikia.krux'
				], (adContextModule,
					adEngineRunnerModule,
					adLogicPageViewCounterModule,
					adConfigMobile,
					adMercuryListener,
					sourcePointDetectionModule,
					krux) => {
					this.adEngineRunnerModule = adEngineRunnerModule;
					this.adContextModule = adContextModule;
					this.sourcePointDetectionModule = sourcePointDetectionModule;
					this.adConfigMobile = adConfigMobile;
					this.adLogicPageViewCounterModule = adLogicPageViewCounterModule;
					this.adMercuryListenerModule = adMercuryListener;
					this.krux = krux;
					this.isLoaded = true;
					this.addDetectionListeners();
					this.reloadWhenReady();
				});
			} else {
				console.error('Looks like ads asset has not been loaded');
			}
		});
	}

	waitForUapResponse(uapCallback, noUapCallback) {
		const wrappedUapCallback = () => {
				this.uapCalled = true;
				this.uapResult = true;

				uapCallback();
			},
			wrappedNoUapCallback = () => {
				this.uapCalled = true;
				this.uapResult = false;

				noUapCallback();
			};

		this.uapCallbacks.push(wrappedUapCallback);
		this.noUapCallbacks.push(wrappedNoUapCallback);

		if (!this.uapCalled) {
			window.addEventListener('wikia.uap', wrappedUapCallback);
			window.addEventListener('wikia.not_uap', wrappedNoUapCallback);
		} else if (this.uapResult) {
			uapCallback();
		} else {
			noUapCallback();
		}
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
			M.tracker.UniversalAnalytics.trackAds(...arguments);
		}
	}

	/**
	 * Track pageview in Krux (imported from Oasis/MediaWiki)
	 *
	 * mobileId variable is the ID referencing to the mobile site
	 * (see ads_run.js and krux.js in app repository)
	 *
	 * @returns {void}
	 */
	trackKruxPageView() {
		if (this.krux && typeof this.krux.load === 'function') {
			console.info('Track pageView: Krux');

			// @todo XW-123 add logging to kibana how many times failed to load
			this.krux.load(M.prop('tracking.krux.mobileId'));
		}
	}

	/**
	 * @param {string} value
	 * @returns {void}
	 */
	trackBlocking(value) {
		M.tracker.UniversalAnalytics.setDimension(6, value);
		M.tracker.UniversalAnalytics.track('ads-sourcepoint-detection', 'impression', value, 0, true);

		Ads.gaTrackAdEvent.call(this, 'ad/sourcepoint/detection', value, '', 0, true);

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
		// TODO: Refactor/remove while working on ADEN-2189
		adsContext = adsContext || {};
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
	 * @param {function?} onContextLoadCallback
	 * @returns {void}
	 */
	reload(adsContext, onContextLoadCallback = null) {
		let delayEnabled = false;

		this.turnOffAdsForLoggedInUsers(adsContext);
		// Store the context for external reuse
		this.setContext(adsContext);
		this.currentAdsContext = adsContext;
		// We need a copy of adSlots as adEngineModule.run destroys it
		this.slotsQueue = this.getSlots();

		if (this.isLoaded && adsContext) {
			this.adContextModule.setContext(adsContext);
			if (typeof onContextLoadCallback === 'function') {
				onContextLoadCallback();
			}
			if (Ads.blocking !== null) {
				this.trackBlocking(Ads.blocking ? 'Yes' : 'No');
			} else {
				this.sourcePointDetectionModule.initDetection();
			}
			if (adsContext.opts) {
				delayEnabled = Boolean(adsContext.opts.delayEngine);
			}
			this.adLogicPageViewCounterModule.increment();
			this.adEngineRunnerModule.run(this.adConfigMobile, this.slotsQueue, 'queue.mercury', delayEnabled);
		}
	}

	/**
	 * This is callback that is run after script is loaded
	 *
	 * @returns {void}
	 */
	reloadWhenReady() {
		this.reload(this.currentAdsContext, () => {
			this.adMercuryListenerModule.startOnLoadQueue();
			this.trackKruxPageView();
		});
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
	 * @param {AdSlot} adSlot - name of the slot
	 * @returns {number} index of the inserted slot
	 */
	addSlot(adSlot) {
		return this.adSlots.push([adSlot]);
	}

	/**
	 * Removes ad slot by name
	 *
	 * @param {string} name - Name of ths slot to remove
	 * @returns {void}
	 */
	removeSlot(name) {
		this.adSlots = $.grep(this.adSlots, (slot) => {
			return slot[0].name ? (slot[0].name === name) : (slot[0] && slot[0] === name);
		}, true);
	}

	removeAllSlots() {
		this.adSlots = [];
	}

	/**
	 * This method is called on each transition
	 *
	 * @returns {void}
	 */
	onTransition() {
		if (this.adMercuryListenerModule && this.adMercuryListenerModule.runOnPageChangeCallbacks) {
			this.adMercuryListenerModule.runOnPageChangeCallbacks();
		}

		this.uapCalled = false;
		this.uapResult = false;

		this.uapCallbacks.forEach((callback) => {
			window.removeEventListener('wikia.uap', callback);
		});
		this.uapCallbacks = [];
		this.noUapCallbacks.forEach((callback) => {
			window.removeEventListener('wikia.not_uap', callback);
		});
		this.noUapCallbacks = [];
	}

	/**
	 * This method is being overwritten in ApplicationRoute for ads needs.
	 * To learn more check routes/application.js file.
	 *
	 * @returns {void}
	 */
	createLightbox() {
	}

	/**
	 * This method is being overwritten in ApplicationRoute for ads needs.
	 * To learn more check routes/application.js file.
	 *
	 * @returns {void}
	 */
	showLightbox() {
	}

	/**
	 * This method is being overwritten in ApplicationRoute for ads needs.
	 * To learn more check routes/application.js file.
	 *
	 * @returns {void}
	 */
	setSiteHeadOffset() {
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
