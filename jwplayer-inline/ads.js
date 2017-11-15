/* eslint no-console: 0 */
import config from './environment';

/**
 * @typedef {Object} SlotsContext
 * @property {Function} isApplicable
 * @property {Function} setStatus
 */

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
 * @property {SourcePointDetectionModule} sourcePointDetectionModule
 * @property {PageFairDetectionModule} pageFairDetectionModule
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
		this.adLogicPageParams = null;
		this.googleTagModule = null;
		this.onReadyCallbacks = [];
		this.adsData = {
			minZerothSectionLength: 700,
			minPageLength: 2000
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

		this.adsUrl = adsUrl;

		// Load the ads code from MW
		$script(adsUrl, () => {
			/* eslint-disable max-params */
			if (window.require) {
				window.require([
					'ext.wikia.adEngine.adContext',
					'ext.wikia.adEngine.adEngineRunner',
					'ext.wikia.adEngine.adLogicPageParams',
					'ext.wikia.adEngine.config.mobile',
					'ext.wikia.adEngine.context.slotsContext',
					'ext.wikia.adEngine.lookup.a9',
					'ext.wikia.adEngine.mobile.mercuryListener',
					'ext.wikia.adEngine.pageFairDetection',
					'ext.wikia.adEngine.provider.gpt.googleTag',
					'ext.wikia.adEngine.sourcePointDetection',
					'ext.wikia.adEngine.video.vastUrlBuilder',
					window.require.optional('wikia.articleVideo.featuredVideo.ads'),
					window.require.optional('wikia.articleVideo.featuredVideo.moatTracking'),
					'wikia.krux'
				], (
					adContextModule,
					adEngineRunnerModule,
					adLogicPageParams,
					adConfigMobile,
					slotsContext,
					a9,
					adMercuryListener,
					pageFairDetectionModule,
					googleTagModule,
					sourcePointDetectionModule,
					vastUrlBuilder,
					jwPlayerAds,
					jwPlayerMoat,
					krux
				) => {
					this.adConfigMobile = adConfigMobile;
					this.adContextModule = adContextModule;
					this.slotsContext = slotsContext;
					this.adEngineRunnerModule = adEngineRunnerModule;
					this.adMercuryListenerModule = adMercuryListener;
					this.googleTagModule = googleTagModule;
					this.vastUrlBuilder = vastUrlBuilder;
					this.krux = krux;
					this.isLoaded = true;
					this.sourcePointDetectionModule = sourcePointDetectionModule;
					this.pageFairDetectionModule = pageFairDetectionModule;
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
		});
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
	 * Dispatch adengine event
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
		if (this.krux && typeof this.krux.load === 'function') {
			console.info('Track pageView: Krux');

			// @todo XW-123 add logging to kibana how many times failed to load
			this.krux.load(config.tracking.krux.mobileId);
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
			hasPageHeader = $('.wiki-page-header').length > 0,
			hasPortableInfobox = $('.portable-infobox').length > 0;

		return isHome || hasPortableInfobox || (hasPageHeader > 0 && !hasFeaturedVideo);
	}

	isInContentApplicable() {
		const $firstSection = $('.article-content > h2').first(),
			firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0,
			hasCuratedContent = $('.curated-content').length > 0;

		if (this.getTargetingValue('pageType') === 'home') {
			return hasCuratedContent;
		}

		return firstSectionTop > this.adsData.minZerothSectionLength;
	}

	isPrefooterApplicable() {
		const articleBodyHeight = $('.article-body').height(),
			hasArticleFooter = $('.article-footer').length > 0,
			hasTrendingArticles = $('.trending-articles').length > 0,
			showInContent = this.isInContentApplicable();

		if (this.getTargetingValue('pageType') === 'home') {
			return hasTrendingArticles;
		}

		return hasArticleFooter && !showInContent || articleBodyHeight > this.adsData.minPageLength;
	}

	isBottomLeaderboardApplicable() {
		return $('.wds-global-footer').length > 0;
	}

	setupSlotsContext() {
		if (!this.slotsContext) {
			return;
		}

		this.slotsContext.setStatus('MOBILE_TOP_LEADERBOARD', this.isTopLeaderboardApplicable());
		this.slotsContext.setStatus('MOBILE_IN_CONTENT', this.isInContentApplicable());
		this.slotsContext.setStatus('MOBILE_PREFOOTER', this.isPrefooterApplicable());
		this.slotsContext.setStatus('MOBILE_BOTTOM_LEADERBOARD', this.isBottomLeaderboardApplicable());
		this.slotsContext.setStatus('INVISIBLE_HIGH_IMPACT_2', !this.getTargetingValue('hasFeaturedVideo'));
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
		if (this.adMercuryListenerModule && this.adMercuryListenerModule.runOnPageChangeCallbacks) {
			this.adMercuryListenerModule.runOnPageChangeCallbacks();
		}

		this.slotsQueue = [];

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
