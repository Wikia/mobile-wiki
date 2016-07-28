/* eslint no-console: 0 */

import load from '../utils/load';

/**
 * @typedef {Object} SourcePointDetectionModule
 * @property {Function} initDetection
 */

/**
 * @typedef {Object} PageFairDetectionModule
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
 * @property {boolean|null} previousSourcePointDetectionResult
 * @property {boolean|null} previousPageFairDetectionResult
 * @property {Array<string[]>} adSlots
 * @property {Object} adsContext
 * @property {*} adEngineRunnerModule
 * @property {*} adContextModule
 * @property {SourcePointDetectionModule} sourcePointDetectionModule
 * @property {PageFairDetectionModule} pageFairDetectionModule
 * @property {*} adConfigMobile
 * @property {AdLogicPageViewCounterModule} adLogicPageViewCounterModule
 * @property {AdMercuryListenerModule} adMercuryListenerModule
 * @property {Object} GASettings
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
		this.GASettings = {
			sourcePoint: {
				name: 'sourcepoint',
				dimension: 6
			},
			pageFair: {
				name: 'pagefair',
				dimension: 7
			}
		};
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
			/* eslint-disable max-params */
			if (window.require) {
				window.require([
					'ext.wikia.adEngine.adContext',
					'ext.wikia.adEngine.adEngineRunner',
					'ext.wikia.adEngine.adLogicPageViewCounter',
					'ext.wikia.adEngine.config.mobile',
					'ext.wikia.adEngine.mobile.mercuryListener',
					'ext.wikia.adEngine.pageFairDetection',
					'ext.wikia.adEngine.sourcePointDetection',
					'wikia.krux'
				], (adContextModule,
					adEngineRunnerModule,
					adLogicPageViewCounterModule,
					adConfigMobile,
					adMercuryListener,
					pageFairDetectionModule,
					sourcePointDetectionModule,
					krux) => {
					this.adEngineRunnerModule = adEngineRunnerModule;
					this.adContextModule = adContextModule;
					this.sourcePointDetectionModule = sourcePointDetectionModule;
					this.adConfigMobile = adConfigMobile;
					this.adLogicPageViewCounterModule = adLogicPageViewCounterModule;
					this.pageFairDetectionModule = pageFairDetectionModule;
					this.adMercuryListenerModule = adMercuryListener;
					this.krux = krux;
					this.isLoaded = true;
					this.addDetectionListeners();
					this.reloadWhenReady();
				});
			} else {
				console.error('Looks like ads asset has not been loaded');
			}
			/* eslint-enable max-params */
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
	 * @param {Object} GAOption
	 * @param {Boolean} isAdBlockDetected
	 * @returns {void}
	 */
	trackBlocking(GAOption, isAdBlockDetected) {
		let value = isAdBlockDetected ? 'Yes' : 'No';

		M.tracker.UniversalAnalytics.setDimension(GAOption.dimension, value);
		M.tracker.UniversalAnalytics.track(`ads-${GAOption.name}-detection`, 'impression', value, 0, true);

		Ads.gaTrackAdEvent.call(this, `ad/${GAOption.name}/detection`, value, '', 0, true);
	}

	/**
	 * @returns {void}
	 */
	addDetectionListeners() {
		const trackBlocking = this.trackBlocking,
			GASettings = this.GASettings,
			listenerSettings = [
				{
					eventName: 'sp.blocking',
					value: true,
					detectorSettings: GASettings.sourcePoint
				},
				{
					eventName: 'sp.not_blocking',
					value: false,
					detectorSettings: GASettings.sourcePoint
				},
				{
					eventName: 'pf.blocking',
					value: true,
					detectorSettings: GASettings.pageFair
				},
				{
					eventName: 'pf.not_blocking',
					value: false,
					detectorSettings: GASettings.pageFair
				}
			];

		listenerSettings.map((listenerSetting) => {
			document.addEventListener(listenerSetting.eventName, () => {
				trackBlocking(listenerSetting.detectorSettings, listenerSetting.value);
			});
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

			if (Ads.previousSourcePointDetectionResult !== null) {
				this.trackBlocking(this.GASettings.sourcePoint, Ads.previousSourcePointDetectionResult);
			} else {
				this.sourcePointDetectionModule.initDetection();
			}

			if (Ads.previousPageFairDetectionResult !== null) {
				this.trackBlocking(this.GASettings.pageFair, Ads.previousPageFairDetectionResult);
			} else {
				this.pageFairDetectionModule.initDetection(adsContext);
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
Ads.previousSourcePointDetectionResult = null;
Ads.previousPageFairDetectionResult = null;

// @TODO XW-703 right now ads code which comes from MW is expecting window.Mercury.Modules.
// When introducing sync require in ads this should be fixed
window.Mercury = window.Mercury || {};
window.Mercury.Modules = window.Mercury.Modules || {};
window.Mercury.Modules.Ads = Ads;

export default Ads;
