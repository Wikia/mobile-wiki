/* eslint no-console: 0 */

import {Promise} from 'rsvp';
import config from '../../config/environment';
import offset from '../../utils/offset';
import adsSetup from './setup';

/**
 * @typedef {Object} SlotsContext
 * @property {Function} isApplicable
 * @property {Function} setStatus
 */

/**
 * @typedef {Object} AdEngineBridge
 * @property {Function} checkAdBlocking
 */

/**
 * @typedef {Object} BabDetectionModule
 * @property {Function} initDetection
 */

/**
 * @typedef {Object} VastUrlBuilder
 * @property {Function} build
 */

/**
 * @typedef {Object} AdMercuryListenerModule
 * @property {Function} startOnLoadQueue
 */

/**
 * @class Ads
 *
 * @property {Ads} instance
 * @property {Object} adsContext
 * @property {Object} previousDetectionResults
 * @property {*} adEngineRunnerModule
 * @property {*} adContextModule
 * @property {AdEngineBridge} adEngineBridge
 * @property {BabDetectionModule} babDetectionModule
 * @property {*} adConfigMobile
 * @property {SlotsContext} slotsContext
 * @property {AdMercuryListenerModule} adMercuryListenerModule
 * @property {Object} GASettings
 * @property {VastUrlBuilder} vastUrlBuilder
 * @property {Krux} krux
 * @property {Object} currentAdsContext
 * @property {Object} googleTag
 * @property {boolean} isLoaded
 * @property {Array<string[]>} slotsQueue
 * @property {Object} a9
 */
class Ads {
	constructor() {
		this.engine = null;
		this.adsContext = null;
		this.currentAdsContext = null;
		this.isLoaded = false;
		this.krux = null;
		this.slotsQueue = [];
		this.uapResult = false;
		this.uapCalled = false;
		this.uapUnsticked = false;
		this.uapCallbacks = [];
		this.noUapCallbacks = [];
		this.GASettings = {
			babDetector: {
				name: 'babdetector',
				dimension: 6
			}
		};
		this.adLogicPageParams = null;
		this.googleTagModule = null;
		this.onReadyCallbacks = [];
		this.adsData = {
			minZerothSectionLength: 700,
			minNumberOfSections: 4
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
	 * @returns {void}
	 */
	init(mediaWikiAdsContext = {}) {
		const {AdEngine} = window.Wikia.adEngine;

		// Required by ads tracking code
		window.gaTrackAdEvent = Ads.gaTrackAdEvent;

		this.addDetectionListeners();
		this.reloadWhenReady();
		this.getInstantGlobals()
			.then((instantGlobals) => {
				adsSetup.configure(mediaWikiAdsContext, instantGlobals);
				this.engine = new AdEngine(); // TODO: adsSetup.init()?
			});
	}

	getInstantGlobals() {
		return new Promise((resolve) => window.getInstantGlobals(resolve));
	}

	isProperGeo(param) {
		const isProperGeo = Wikia && Wikia.geo && Wikia.geo.isProperGeo;
		return typeof isProperGeo === 'function' && isProperGeo(param);
	}

	/**
	 * Build VAST url for video players
	 *
	 * @param {number} aspectRatio
	 * @param {Object} slotParams
	 * @param {Object} options
	 *
	 * @returns {string}
	 */
	buildVastUrl(aspectRatio, slotParams, options) {
		if (!this.vastUrlBuilder) {
			console.warn('Can not build VAST url.');
			return '';
		}

		return this.vastUrlBuilder.build(aspectRatio, slotParams, options);
	}

	/**
	 * Dispatch AdEngine event
	 *
	 * @param {string} name
	 * @param {Object} data
	 *
	 * @returns {void}
	 */
	dispatchEvent(name, data) {
		const event = document.createEvent('CustomEvent');

		event.initCustomEvent(`adengine.${name}`, true, true, data || {});
		window.dispatchEvent(event);
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
		// if (this.krux && typeof this.krux.load === 'function') {
		// 	console.info('Track pageView: Krux');

		// 	// @todo XW-123 add logging to kibana how many times failed to load
		// 	this.krux.load(config.tracking.krux.mobileId);
		// }
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
					name: 'babDetector',
					eventName: 'bab.blocking',
					value: true,
				},
				{
					name: 'babDetector',
					eventName: 'bab.not_blocking',
					value: false,
				},
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

	getTargetingValue(key) {
		return this.adsContext && this.adsContext.targeting && this.adsContext.targeting[key];
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
		if (adsContext.user && adsContext.user.isAuthenticated) {
			adsContext.opts = adsContext.opts || {};
			adsContext.opts.showAds = false;
			adsContext.opts.pageType = 'no_ads';
		}
	}

	isTopLeaderboardApplicable() {
		const hasFeaturedVideo = this.getTargetingValue('hasFeaturedVideo'),
			isHome = this.getTargetingValue('pageType') === 'home',
			hasPageHeader = !!document.querySelector('.wiki-page-header'),
			hasPortableInfobox = !!document.querySelector('.portable-infobox');

		return isHome || hasPortableInfobox || (hasPageHeader > 0 && !hasFeaturedVideo);
	}

	isInContentApplicable() {
		if (this.getTargetingValue('pageType') === 'home') {
			return !!document.querySelector('.curated-content');
		}

		const firstSection = document.querySelector('.article-content > h2'),
			firstSectionTop = (
				firstSection &&
				offset(firstSection).top
			) || 0;

		return firstSectionTop > this.adsData.minZerothSectionLength;
	}

	isPrefooterApplicable(isInContentApplicable) {
		if (this.getTargetingValue('pageType') === 'home') {
			return !!document.querySelector('.trending-articles');
		}

		const numberOfSections = document.querySelectorAll('.article-content > h2').length,
			hasArticleFooter = !!document.querySelector('.article-footer');

		return hasArticleFooter && !isInContentApplicable || numberOfSections > this.adsData.minNumberOfSections;
	}

	isBottomLeaderboardApplicable() {
		return !!document.querySelector('.wds-global-footer');
	}

	setupSlotsContext() {
		if (!this.slotsContext) {
			return;
		}

		const isInContentApplicable = this.isInContentApplicable();

		this.slotsContext.setStatus('MOBILE_TOP_LEADERBOARD', this.isTopLeaderboardApplicable());
		this.slotsContext.setStatus('MOBILE_IN_CONTENT', isInContentApplicable);
		this.slotsContext.setStatus('MOBILE_PREFOOTER', this.isPrefooterApplicable(isInContentApplicable));
		this.slotsContext.setStatus('BOTTOM_LEADERBOARD', this.isBottomLeaderboardApplicable());
		this.slotsContext.setStatus('INVISIBLE_HIGH_IMPACT_2', !this.getTargetingValue('hasFeaturedVideo'));
		this.slotsContext.setStatus('FEATURED', this.getTargetingValue('hasFeaturedVideo'));
	}

	isSlotApplicable(slotName) {
		return !this.slotsContext || this.slotsContext.isApplicable(slotName);
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

		if (this.isLoaded) {
			this.setupSlotsContext();
			if (this.adMercuryListenerModule) {
				this.adMercuryListenerModule.onPageChange(() => {
					this.googleTagModule.updateCorrelator();
				});
			}
			if (adsContext) {
				this.adContextModule.setContext(adsContext);

				this.onReadyCallbacks.forEach((callback) => callback());
				this.onReadyCallbacks = [];

				if (typeof onContextLoadCallback === 'function') {
					onContextLoadCallback();
				}

				if (Ads.previousDetectionResults.babDetector.exists) {
					this.trackBlocking('babDetector', this.GASettings.babDetector,
						Ads.previousDetectionResults.babDetector.value);
				} else if (adsContext.opts && adsContext.opts.babDetectionMobile) {
					this.adEngineBridge.checkAdBlocking(this.babDetectionModule);
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
		});
	}

	/**
	 * This is a callback that is run after transition (when article is already loaded)
	 *
	 * @param {*} adsContext
	 *
	 * @returns {void}
	 */
	reloadAfterTransition(adsContext) {
		this.reload(adsContext, () => {
			if (this.adMercuryListenerModule && this.adMercuryListenerModule.runAfterPageWithAdsRenderCallbacks) {
				this.adMercuryListenerModule.runAfterPageWithAdsRenderCallbacks();
			}
		});
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
	 * Removes ad slot by name
	 *
	 * @param {string} name - Name of ths slot to remove
	 * @returns {void}
	 */
	removeSlot(name) {
		if (this.googleTagModule) {
			this.googleTagModule.destroySlots([name]);
		}
	}

	/**
	 * This method is called on each transition
	 *
	 * @returns {void}
	 */
	onTransition() {
		this.events.pageChange();

		this.slotsQueue = [];

		this.uapCalled = false;
		this.uapResult = false;
		this.uapUnsticked = false;

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
	 */
	onReady(callback) {
		if (this.isLoaded) {
			callback();
		} else {
			this.onReadyCallbacks.push(callback);
		}
	}

	waitForReady() {
		return new Promise((resolve) => this.onReady(resolve));
	}

	/**
	 * This method is called on menu or search open
	 *
	 * @returns {void}
	 */
	onMenuOpen() {
		if (!this.uapUnsticked) {
			this.uapUnsticked = true;
			this.adMercuryListenerModule.runOnMenuOpenCallbacks();
			this.events.menuOpen();
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
	babDetector: {
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
