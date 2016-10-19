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
 * @typedef {Object} VastUrlBuilder
 * @property {Function} build
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
 * @property {Array<string[]>} adSlots
 * @property {Object} adsContext
 * @property {Object} previousDetectionResults
 * @property {*} adEngineRunnerModule
 * @property {*} adContextModule
 * @property {SourcePointDetectionModule} sourcePointDetectionModule
 * @property {PageFairDetectionModule} pageFairDetectionModule
 * @property {*} adConfigMobile
 * @property {AdMercuryListenerModule} adMercuryListenerModule
 * @property {Object} GASettings
 * @property {VastUrlBuilder} vastUrlBuilder
 * @property {Krux} krux
 * @property {Object} currentAdsContext
 * @property {Object} googleTag
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
		this.adLogicPageViewCounterModule = null;
		this.adLogicPageParams = null;
		this.googleTagModule = null;
		this.mercuryPV = 1;
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
					'ext.wikia.adEngine.adLogicPageParams',
					'ext.wikia.adEngine.adLogicPageViewCounter',
					'ext.wikia.adEngine.config.mobile',
					'ext.wikia.adEngine.mobile.mercuryListener',
					'ext.wikia.adEngine.pageFairDetection',
					'ext.wikia.adEngine.provider.gpt.googleTag',
					'ext.wikia.adEngine.sourcePointDetection',
					'ext.wikia.adEngine.video.vastUrlBuilder',
					'wikia.krux'
				], (adContextModule,
					adEngineRunnerModule,
					adLogicPageParams,
					adLogicPageViewCounterModule,
					adConfigMobile,
					adMercuryListener,
					pageFairDetectionModule,
					googleTagModule,
					sourcePointDetectionModule,
					vastUrlBuilder,
					krux) => {
					this.adConfigMobile = adConfigMobile;
					this.adContextModule = adContextModule;
					this.adEngineRunnerModule = adEngineRunnerModule;
					this.adLogicPageViewCounterModule = adLogicPageViewCounterModule;
					this.adMercuryListenerModule = adMercuryListener;
					this.googleTagModule = googleTagModule;
					this.vastUrlBuilder = vastUrlBuilder;
					this.krux = krux;
					this.isLoaded = true;
					this.krux = krux;
					this.sourcePointDetectionModule = sourcePointDetectionModule;
					this.pageFairDetectionModule = pageFairDetectionModule;
					this.adLogicPageParams = adLogicPageParams;
					this.addDetectionListeners();
					this.reloadWhenReady();
				});
			} else {
				console.error('Looks like ads asset has not been loaded');
			}
			/* eslint-enable max-params */
		});
	}

	/**
	 * Build VAST url for video players
	 *
	 * @param {number} aspectRatio
	 * @param {Object} slotParams
	 *
	 * @returns {string}
	 */
	buildVastUrl(aspectRatio, slotParams) {
		if (!this.vastUrlBuilder) {
			console.warn('Can not build VAST url.');
			return '';
		}

		return this.vastUrlBuilder.build(aspectRatio, slotParams);
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
	 * @param {String} name
	 * @param {Object} GAOption
	 * @param {Boolean} isAdBlockDetected
	 * @returns {void}
	 */
	trackBlocking(name, GAOption, isAdBlockDetected) {
		let value = isAdBlockDetected ? 'Yes' : 'No';

		Ads.setPreviousDetectionResult(name, isAdBlockDetected);
		M.tracker.UniversalAnalytics.setDimension(GAOption.dimension, value);
		M.tracker.UniversalAnalytics.track(`ads-${GAOption.name}-detection`, 'impression', value, 0, true);

		Ads.gaTrackAdEvent.call(this, `ad/${GAOption.name}/detection`, value, '', 0, true);
	}

	static setPreviousDetectionResult(name, isAdBlockDetected) {
		Ads.previousDetectionResults[name].value = isAdBlockDetected;
		Ads.previousDetectionResults[name].exists = true;
	}

	/**
	 * @returns {void}
	 */
	addDetectionListeners() {
		const GASettings = this.GASettings,
			listenerSettings = [
				{
					name: 'sourcePoint',
					eventName: 'sp.blocking',
					value: true,
				},
				{
					name: 'sourcePoint',
					eventName: 'sp.not_blocking',
					value: false,
				},
				{
					name: 'pageFair',
					eventName: 'pf.blocking',
					value: true,
				},
				{
					name: 'pageFair',
					eventName: 'pf.not_blocking',
					value: false,
				}
			];

		listenerSettings.map((listenerSetting) => {
			document.addEventListener(listenerSetting.eventName, () => {
				this.trackBlocking(listenerSetting.name, GASettings[listenerSetting.name], listenerSetting.value);
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

		if (this.isLoaded) {
			this.adMercuryListenerModule.onPageChange(() => {
				this.adLogicPageViewCounterModule.increment();
				this.googleTagModule.updateCorrelator();
				this.mercuryPV = this.mercuryPV + 1;
				this.adLogicPageParams.add('mercuryPV', this.mercuryPV);
			});
			if (adsContext) {
				this.adContextModule.setContext(adsContext);
				if (typeof onContextLoadCallback === 'function') {
					onContextLoadCallback();
				}

				if (Ads.previousDetectionResults.sourcePoint.exists) {
					this.trackBlocking(
						'sourcePoint',
						this.GASettings.sourcePoint,
						Ads.previousDetectionResults.sourcePoint.value
					);
				} else {
					this.sourcePointDetectionModule.initDetection();
				}

				if (Ads.previousDetectionResults.pageFair.exists) {
					this.trackBlocking('pageFair', this.GASettings.pageFair, Ads.previousDetectionResults.pageFair.value);
				} else if (adsContext.opts && adsContext.opts.pageFairDetection) {
					this.pageFairDetectionModule.initDetection(adsContext);
				}

				if (adsContext.opts) {
					delayEnabled = Boolean(adsContext.opts.delayEngine);
				}

				this.adEngineRunnerModule.run(this.adConfigMobile, this.slotsQueue, 'queue.mercury', delayEnabled);
			}
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
			this.adLogicPageParams.add('mercuryPV', this.mercuryPV);
			this.adLogicPageViewCounterModule.increment();
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
	 * @param {string} name - ad slot name
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

		this.googleTagModule.destroySlots([name]);
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
	 * Execute when ads package is ready to use
	 *
	 * @param {function} callback
	 * @param {object} context
	 */
	onReady(callback, context) {
		const url = M.prop('adsUrl');
		if (url) {
			$script.ready(url, () => {
				callback.apply(context);
			});
		}
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
Ads.previousDetectionResults = {
	pageFair: {
		exists: false,
		value: null
	},
	sourcePoint: {
		exists: false,
		value: null
	}
};

// @TODO XW-703 right now ads code which comes from MW is expecting window.Mercury.Modules.
// When introducing sync require in ads this should be fixed
window.Mercury = window.Mercury || {};
window.Mercury.Modules = window.Mercury.Modules || {};
window.Mercury.Modules.Ads = Ads;

export default Ads;
