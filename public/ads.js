'use strict';


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Ads = function () {
	function Ads() {
		_classCallCheck(this, Ads);

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


	_createClass(Ads, [{
		key: 'init',


		/**
		 * Initializes the Ad module
		 *
		 * @param {string} adsUrl - Url for the ads script
		 * @returns {void}
		 */
		value: function init(adsUrl) {
			var _this = this;

			// Required by ads tracking code
			window.gaTrackAdEvent = Ads.gaTrackAdEvent;

			this.adsUrl = adsUrl;

			// Load the ads code from MW
			$script(adsUrl, function () {
				/* eslint-disable max-params */
				if (window.require) {
					window.require(['ext.wikia.adEngine.adContext', 'ext.wikia.adEngine.adEngineRunner', 'ext.wikia.adEngine.adLogicPageParams', 'ext.wikia.adEngine.config.mobile', 'ext.wikia.adEngine.context.slotsContext', 'ext.wikia.adEngine.lookup.a9', 'ext.wikia.adEngine.mobile.mercuryListener', 'ext.wikia.adEngine.pageFairDetection', 'ext.wikia.adEngine.provider.gpt.googleTag', 'ext.wikia.adEngine.sourcePointDetection', 'ext.wikia.adEngine.video.vastUrlBuilder', window.require.optional('wikia.articleVideo.featuredVideo.ads'), window.require.optional('wikia.articleVideo.featuredVideo.moatTracking'), 'wikia.krux'], function (adContextModule, adEngineRunnerModule, adLogicPageParams, adConfigMobile, slotsContext, a9, adMercuryListener, pageFairDetectionModule, googleTagModule, sourcePointDetectionModule, vastUrlBuilder, jwPlayerAds, jwPlayerMoat, krux) {
						_this.adConfigMobile = adConfigMobile;
						_this.adContextModule = adContextModule;
						_this.slotsContext = slotsContext;
						_this.adEngineRunnerModule = adEngineRunnerModule;
						_this.adMercuryListenerModule = adMercuryListener;
						_this.googleTagModule = googleTagModule;
						_this.vastUrlBuilder = vastUrlBuilder;
						_this.krux = krux;
						_this.isLoaded = true;
						_this.sourcePointDetectionModule = sourcePointDetectionModule;
						_this.pageFairDetectionModule = pageFairDetectionModule;
						_this.adLogicPageParams = adLogicPageParams;
						_this.a9 = a9;
						_this.jwPlayerAds = jwPlayerAds;
						_this.jwPlayerMoat = jwPlayerMoat;

						_this.addDetectionListeners();
						_this.reloadWhenReady();
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

	}, {
		key: 'buildVastUrl',
		value: function buildVastUrl(aspectRatio, slotParams, options) {
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

	}, {
		key: 'dispatchEvent',
		value: function dispatchEvent(name, data) {
			var event = document.createEvent('CustomEvent');

			event.initCustomEvent('adengine.' + name, true, true, data || {});
			window.dispatchEvent(event);
		}
	}, {
		key: 'waitForUapResponse',
		value: function waitForUapResponse(uapCallback, noUapCallback) {
			var _this2 = this;

			var wrappedUapCallback = function wrappedUapCallback() {
					_this2.uapCalled = true;
					_this2.uapResult = true;

					uapCallback();
				},
				wrappedNoUapCallback = function wrappedNoUapCallback() {
					_this2.uapCalled = true;
					_this2.uapResult = false;

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

	}, {
		key: 'trackKruxPageView',


		/**
		 * Track pageview in Krux (imported from Oasis/MediaWiki)
		 *
		 * mobileId variable is the ID referencing to the mobile site
		 * (see ads_run.js and krux.js in app repository)
		 *
		 * @returns {void}
		 */
		value: function trackKruxPageView() {
			if (this.krux && typeof this.krux.load === 'function') {
				console.info('Track pageView: Krux');

				// @todo XW-123 add logging to kibana how many times failed to load
				this.krux.load('JTKzTN3f');
			}
		}

		/**
		 * @param {String} name
		 * @param {Object} GAOption
		 * @param {Boolean} isAdBlockDetected
		 * @returns {void}
		 */

	}, {
		key: 'trackBlocking',
		value: function trackBlocking(name, GAOption, isAdBlockDetected) {
			var value = isAdBlockDetected ? 'Yes' : 'No';

			Ads.setPreviousDetectionResult(name, isAdBlockDetected);
			M.tracker.UniversalAnalytics.setDimension(GAOption.dimension, value);
			M.tracker.UniversalAnalytics.track('ads-' + GAOption.name + '-detection', 'impression', value, 0, true);

			Ads.gaTrackAdEvent.call(this, 'ad/' + GAOption.name + '/detection', value, '', 0, true);
		}
	}, {
		key: 'addDetectionListeners',


		/**
		 * @returns {void}
		 */
		value: function addDetectionListeners() {
			var _this3 = this;

			var GASettings = this.GASettings,
				listenerSettings = [{
					name: 'sourcePoint',
					eventName: 'sp.blocking',
					value: true
				}, {
					name: 'sourcePoint',
					eventName: 'sp.not_blocking',
					value: false
				}, {
					name: 'pageFair',
					eventName: 'pf.blocking',
					value: true
				}, {
					name: 'pageFair',
					eventName: 'pf.not_blocking',
					value: false
				}];

			listenerSettings.map(function (listenerSetting) {
				document.addEventListener(listenerSetting.eventName, function () {
					_this3.trackBlocking(listenerSetting.name, GASettings[listenerSetting.name], listenerSetting.value);
				});
			});
		}

		/**
		 * @param {*} adsContext
		 * @returns {void}
		 */

	}, {
		key: 'setContext',
		value: function setContext(adsContext) {
			this.adsContext = adsContext ? adsContext : null;
		}
	}, {
		key: 'getTargetingValue',
		value: function getTargetingValue(key) {
			return this.adsContext && this.adsContext.targeting && this.adsContext.targeting[key];
		}

		/**
		 * Turns off all ads for logged in user
		 *
		 * @param {*} adsContext
		 * @returns {void}
		 */

	}, {
		key: 'turnOffAdsForLoggedInUsers',
		value: function turnOffAdsForLoggedInUsers(adsContext) {
			// TODO: Refactor/remove while working on ADEN-2189
			adsContext = adsContext || {};
			if (adsContext.user && adsContext.user.isAuthenticated) {
				adsContext.opts = adsContext.opts || {};
				adsContext.opts.showAds = false;
				adsContext.opts.pageType = 'no_ads';
			}
		}
	}, {
		key: 'isTopLeaderboardApplicable',
		value: function isTopLeaderboardApplicable() {
			var hasFeaturedVideo = this.getTargetingValue('hasFeaturedVideo'),
				isHome = this.getTargetingValue('pageType') === 'home',
				hasPageHeader = $('.wiki-page-header').length > 0,
				hasPortableInfobox = $('.portable-infobox').length > 0;

			return isHome || hasPortableInfobox || hasPageHeader > 0 && !hasFeaturedVideo;
		}
	}, {
		key: 'isInContentApplicable',
		value: function isInContentApplicable() {
			var $firstSection = $('.article-content > h2').first(),
				firstSectionTop = $firstSection.length && $firstSection.offset().top || 0,
				hasCuratedContent = $('.curated-content').length > 0;

			if (this.getTargetingValue('pageType') === 'home') {
				return hasCuratedContent;
			}

			return firstSectionTop > this.adsData.minZerothSectionLength;
		}
	}, {
		key: 'isPrefooterApplicable',
		value: function isPrefooterApplicable() {
			var articleBodyHeight = $('.article-body').height(),
				hasArticleFooter = $('.article-footer').length > 0,
				hasTrendingArticles = $('.trending-articles').length > 0,
				showInContent = this.isInContentApplicable();

			if (this.getTargetingValue('pageType') === 'home') {
				return hasTrendingArticles;
			}

			return hasArticleFooter && !showInContent || articleBodyHeight > this.adsData.minPageLength;
		}
	}, {
		key: 'isBottomLeaderboardApplicable',
		value: function isBottomLeaderboardApplicable() {
			return $('.wds-global-footer').length > 0;
		}
	}, {
		key: 'setupSlotsContext',
		value: function setupSlotsContext() {
			if (!this.slotsContext) {
				return;
			}

			this.slotsContext.setStatus('MOBILE_TOP_LEADERBOARD', this.isTopLeaderboardApplicable());
			this.slotsContext.setStatus('MOBILE_IN_CONTENT', this.isInContentApplicable());
			this.slotsContext.setStatus('MOBILE_PREFOOTER', this.isPrefooterApplicable());
			this.slotsContext.setStatus('MOBILE_BOTTOM_LEADERBOARD', this.isBottomLeaderboardApplicable());
			this.slotsContext.setStatus('INVISIBLE_HIGH_IMPACT_2', !this.getTargetingValue('hasFeaturedVideo'));
		}
	}, {
		key: 'isSlotApplicable',
		value: function isSlotApplicable(slotName) {
			return !this.slotsContext || this.slotsContext.isApplicable(slotName);
		}

		/**
		 * Reloads the ads with the provided adsContext
		 *
		 * @param {*} adsContext
		 * @param {function?} onContextLoadCallback
		 * @returns {void}
		 */

	}, {
		key: 'reload',
		value: function reload(adsContext) {
			var _this4 = this;

			var onContextLoadCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var delayEnabled = false;

			this.turnOffAdsForLoggedInUsers(adsContext);
			// Store the context for external reuse
			this.setContext(adsContext);
			this.currentAdsContext = adsContext;

			if (this.isLoaded) {
				this.setupSlotsContext();
				if (this.adMercuryListenerModule) {
					this.adMercuryListenerModule.onPageChange(function () {
						_this4.googleTagModule.updateCorrelator();
					});
				}
				if (adsContext) {
					this.adContextModule.setContext(adsContext);

					this.onReadyCallbacks.forEach(function (callback) {
						return callback();
					});
					this.onReadyCallbacks = [];

					if (typeof onContextLoadCallback === 'function') {
						onContextLoadCallback();
					}

					if (Ads.previousDetectionResults.sourcePoint.exists) {
						this.trackBlocking('sourcePoint', this.GASettings.sourcePoint, Ads.previousDetectionResults.sourcePoint.value);
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

	}, {
		key: 'reloadWhenReady',
		value: function reloadWhenReady() {
			var _this5 = this;

			this.reload(this.currentAdsContext, function () {
				_this5.adMercuryListenerModule.startOnLoadQueue();
				_this5.trackKruxPageView();
			});
		}

		/**
		 * This is a callback that is run after transition (when article is already loaded)
		 *
		 * @param {*} adsContext
		 *
		 * @returns {void}
		 */

	}, {
		key: 'reloadAfterTransition',
		value: function reloadAfterTransition(adsContext) {
			var _this6 = this;

			this.reload(adsContext, function () {
				if (_this6.adMercuryListenerModule && _this6.adMercuryListenerModule.runAfterPageWithAdsRenderCallbacks) {
					_this6.adMercuryListenerModule.runAfterPageWithAdsRenderCallbacks();
				}
			});
		}

		/**
		 * Push slot to the current queue (refresh ad in given slot)
		 *
		 * @param {string} name - name of the slot
		 * @returns {void}
		 */

	}, {
		key: 'pushSlotToQueue',
		value: function pushSlotToQueue(name) {
			this.slotsQueue.push([name]);
		}

		/**
		 * Removes ad slot by name
		 *
		 * @param {string} name - Name of ths slot to remove
		 * @returns {void}
		 */

	}, {
		key: 'removeSlot',
		value: function removeSlot(name) {
			if (this.googleTagModule) {
				this.googleTagModule.destroySlots([name]);
			}
		}

		/**
		 * This method is called on each transition
		 *
		 * @returns {void}
		 */

	}, {
		key: 'onTransition',
		value: function onTransition() {
			if (this.adMercuryListenerModule && this.adMercuryListenerModule.runOnPageChangeCallbacks) {
				this.adMercuryListenerModule.runOnPageChangeCallbacks();
			}

			this.slotsQueue = [];

			this.uapCalled = false;
			this.uapResult = false;

			this.uapCallbacks.forEach(function (callback) {
				window.removeEventListener('wikia.uap', callback);
			});
			this.uapCallbacks = [];
			this.noUapCallbacks.forEach(function (callback) {
				window.removeEventListener('wikia.not_uap', callback);
			});
			this.noUapCallbacks = [];
		}

		/**
		 * Execute when ads package is ready to use
		 *
		 * @param {function} callback
		 */

	}, {
		key: 'onReady',
		value: function onReady(callback) {
			if (this.isLoaded) {
				callback();
			} else {
				this.onReadyCallbacks.push(callback);
			}
		}
	}, {
		key: 'waitForReady',
		value: function waitForReady() {
			var _this7 = this;

			return new Promise(function (resolve) {
				return _this7.onReady(resolve);
			});
		}

		/**
		 * This method is being overwritten in ApplicationRoute for ads needs.
		 * To learn more check routes/application.js file.
		 *
		 * @returns {void}
		 */

	}, {
		key: 'createLightbox',
		value: function createLightbox() {}

		/**
		 * This method is being overwritten in ApplicationRoute for ads needs.
		 * To learn more check routes/application.js file.
		 *
		 * @returns {void}
		 */

	}, {
		key: 'showLightbox',
		value: function showLightbox() {}

		/**
		 * This method is being overwritten in ApplicationRoute for ads needs.
		 * To learn more check routes/application.js file.
		 *
		 * @returns {void}
		 */

	}, {
		key: 'setSiteHeadOffset',
		value: function setSiteHeadOffset() {}

		/**
		 * Retrieves the ads context
		 *
		 * @returns {Object|null}
		 */

	}, {
		key: 'getContext',
		value: function getContext() {
			return this.adsContext;
		}
	}], [{
		key: 'getInstance',
		value: function getInstance() {
			if (Ads.instance === null) {
				Ads.instance = new Ads();
			}
			return Ads.instance;
		}
	}, {
		key: 'gaTrackAdEvent',
		value: function gaTrackAdEvent() {
			// Percentage of all the track requests to go through
			var adHitSample = 1;

			// Sampling on GA side will kill the performance as we need to allocate object each time we track
			// ToDo: Optimize object allocation for tracking all events
			if (Math.random() * 100 <= adHitSample) {
				var _M$tracker$UniversalA;

				(_M$tracker$UniversalA = M.tracker.UniversalAnalytics).trackAds.apply(_M$tracker$UniversalA, arguments);
			}
		}
	}, {
		key: 'setPreviousDetectionResult',
		value: function setPreviousDetectionResult(name, isAdBlockDetected) {
			Ads.previousDetectionResults[name].value = isAdBlockDetected;
			Ads.previousDetectionResults[name].exists = true;
		}
	}]);

	return Ads;
}();

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
