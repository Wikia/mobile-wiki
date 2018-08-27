/* eslint-disable class-methods-use-this */
/* eslint no-console: 0 */
import { Promise } from 'rsvp';
import config from '../../config/environment';
import offset from '../../utils/offset';
/* eslint import/no-cycle: 0 */
// legacy module will be removed when Ad Engine 3 will be realeased sitewide
import { track } from '../../utils/track';

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
				dimension: 6,
			},
		};
		this.adSlotsConfig = {
			MOBILE_TOP_LEADERBOARD: {
				// ATF slot is pushed immediately (without any delay/in single request with other slots)
				isAboveTheFold: true,
			},
			MOBILE_PREFOOTER: {
				disableManualInsert: true,
			},
		};
		this.adLogicPageParams = null;
		this.googleTagModule = null;
		this.onReadyCallbacks = [];
		this.adsData = {
			minZerothSectionLength: 700,
			minNumberOfSections: 4,
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
	init() {
		M.trackingQueue.push(() => this.loadLegacyModules());
	}

	loadLegacyModules() {
		// Required by ads tracking code
		window.gaTrackAdEvent = Ads.gaTrackAdEvent;

		/* eslint-disable max-params */
		if (window.require) {
			window.require([
				'ext.wikia.adEngine.bridge',
				'ext.wikia.adEngine.adContext',
				'ext.wikia.adEngine.adEngineRunner',
				'ext.wikia.adEngine.adLogicPageParams',
				'ext.wikia.adEngine.config.mobile',
				'ext.wikia.adEngine.context.slotsContext',
				'ext.wikia.adEngine.lookup.a9',
				'ext.wikia.adEngine.mobile.mercuryListener',
				'ext.wikia.adEngine.provider.gpt.googleTag',
				'ext.wikia.adEngine.video.vastUrlBuilder',
				'ext.wikia.adEngine.wad.babDetection',
				window.require.optional('wikia.articleVideo.featuredVideo.ads'),
				window.require.optional('wikia.articleVideo.featuredVideo.moatTracking'),
				'wikia.krux',
			], (
				adEngineBridge,
				adContextModule,
				adEngineRunnerModule,
				adLogicPageParams,
				adConfigMobile,
				slotsContext,
				a9,
				adMercuryListener,
				googleTagModule,
				vastUrlBuilder,
				babDetectionModule,
				jwPlayerAds,
				jwPlayerMoat,
				krux,
			) => {
				this.adEngineBridge = adEngineBridge;
				this.adConfigMobile = adConfigMobile;
				this.adContextModule = adContextModule;
				this.slotsContext = slotsContext;
				this.adEngineRunnerModule = adEngineRunnerModule;
				this.adMercuryListenerModule = adMercuryListener;
				this.googleTagModule = googleTagModule;
				this.vastUrlBuilder = vastUrlBuilder;
				this.krux = krux;
				this.isLoaded = true;
				this.babDetectionModule = babDetectionModule;
				this.adLogicPageParams = adLogicPageParams;
				this.a9 = a9;
				this.jwPlayerAds = jwPlayerAds;
				this.jwPlayerMoat = jwPlayerMoat;

				this.addDetectionListeners();
				this.reloadWhenReady();
			});
		} else {
			console.error('Looks like ads asset has not been loaded');
		}
		/* eslint-enable max-params */
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
		};
		const wrappedNoUapCallback = () => {
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
			this.krux.load(config.APP.tracking.krux.mobileId);
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
		const GASettings = this.GASettings;
		const listenerSettings = [{
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

		listenerSettings.forEach((listenerSetting) => {
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
		this.adsContext = adsContext || null;
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
		const hasFeaturedVideo = this.getTargetingValue('hasFeaturedVideo');
		const isHome = this.getTargetingValue('pageType') === 'home';
		const hasPageHeader = !!document.querySelector('.wiki-page-header');
		const hasPortableInfobox = !!document.querySelector('.portable-infobox');

		return isHome || hasPortableInfobox || (hasPageHeader > 0 && !hasFeaturedVideo);
	}

	isInContentApplicable() {
		if (this.getTargetingValue('pageType') === 'home') {
			return !!document.querySelector('.curated-content');
		}

		const firstSection = document.querySelector('.article-content > h2');
		const firstSectionTop = (
			firstSection
			&& offset(firstSection).top
		) || 0;

		return firstSectionTop > this.adsData.minZerothSectionLength;
	}

	isPrefooterApplicable(isInContentApplicable) {
		if (this.getTargetingValue('pageType') === 'home') {
			return !!document.querySelector('.trending-articles');
		}

		const numberOfSections = document.querySelectorAll('.article-content > h2').length;
		const hasArticleFooter = !!document.querySelector('.article-footer');

		return hasArticleFooter && !isInContentApplicable || numberOfSections > this.adsData.minNumberOfSections;
	}

	isBottomLeaderboardApplicable() {
		return !!document.querySelector('.wds-global-footer');
	}

	isArticleSectionCollapsed() {
		return this.adContextModule && this.adContextModule.get('opts.mobileSectionsCollapse');
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

				this.onReadyCallbacks.forEach(callback => callback());
				this.onReadyCallbacks = [];

				if (typeof onContextLoadCallback === 'function') {
					onContextLoadCallback();
				}

				if (Ads.previousDetectionResults.babDetector.exists) {
					this.trackBlocking('babDetector', this.GASettings.babDetector,
						Ads.previousDetectionResults.babDetector.value);

					track({
						category: 'ads-babdetector-detection',
						action: 'impression',
						label: Ads.previousDetectionResults.babDetector.value ? 'Yes' : 'No',
						value: 0,
						trackingMethod: 'internal',
					});
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

	getAdSlotComponentAttributes(slotName) {
		const config = this.adSlotsConfig[slotName] || {};

		return {
			disableManualInsert: !!config.disableManualInsert,
			isAboveTheFold: !!config.isAboveTheFold,
			name: slotName,
			hiddenClassName: 'hidden',
		};
	}

	finishAtfQueue() {
		// Do nothing
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
	afterTransition(adsContext) {
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
		if (this.adMercuryListenerModule && this.adMercuryListenerModule.runOnPageChangeCallbacks) {
			this.adMercuryListenerModule.runOnPageChangeCallbacks();
		}

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
		return new Promise(resolve => this.onReady(resolve));
	}

	/**
	 * This method is called on menu or search open
	 *
	 * @returns {void}
	 */
	onMenuOpen() {
		if (!this.uapUnsticked && this.adMercuryListenerModule && this.adMercuryListenerModule.runOnMenuOpenCallbacks) {
			this.uapUnsticked = true;
			this.adMercuryListenerModule.runOnMenuOpenCallbacks();
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

	initJWPlayer(player, bidParams, slotTargeting) {
		if (this.jwPlayerAds && this.jwPlayerMoat) {
			this.jwPlayerAds(player, bidParams, slotTargeting);
			this.jwPlayerMoat.track(player);
		}
	}

}

Ads.instance = null;
Ads.previousDetectionResults = {
	babDetector: {
		exists: false,
		value: null,
	},
};

// @TODO XW-703 right now ads code which comes from MW is expecting window.Mercury.Modules.
// When introducing sync require in ads this should be fixed
window.Mercury = window.Mercury || {};
window.Mercury.Modules = window.Mercury.Modules || {};
window.Mercury.Modules.Ads = Ads;

export default Ads;
