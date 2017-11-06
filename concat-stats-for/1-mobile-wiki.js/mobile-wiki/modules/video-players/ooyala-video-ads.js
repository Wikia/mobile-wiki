define('mobile-wiki/modules/video-players/ooyala-video-ads', ['exports', 'mobile-wiki/modules/ads', 'mobile-wiki/modules/video-players/moat-video-tracker'], function (exports, _ads, _moatVideoTracker) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var OoyalaVideoAds = function () {
		function OoyalaVideoAds(params, trackingParams) {
			_classCallCheck(this, OoyalaVideoAds);

			this.params = params;
			this.trackingParams = trackingParams;
		}

		_createClass(OoyalaVideoAds, [{
			key: 'getOoyalaConfig',
			value: function getOoyalaConfig() {
				var _this = this;

				if (this.params.noAds) {
					return this.params;
				} else if (this.isA9VideoEnabled()) {
					return this.parseBidderParameters().catch(function () {}).then(function (bidParams) {
						return _this.setupAdManager(bidParams);
					});
				} else {
					return this.setupAdManager();
				}
			}
		}, {
			key: 'setupAdManager',
			value: function setupAdManager() {
				var bidParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				this.params['google-ima-ads-manager'] = this.getAdsManagerConfig(bidParams);
				this.params.replayAds = false;

				return this.params;
			}
		}, {
			key: 'parseBidderParameters',
			value: function parseBidderParameters() {
				var a9 = _ads.default.getInstance().a9;

				if (!a9 || !this.isA9VideoEnabled()) {
					return {};
				}

				return a9.waitForResponse().then(function () {
					return a9.getSlotParams('FEATURED');
				});
			}
		}, {
			key: 'isA9VideoEnabled',
			value: function isA9VideoEnabled() {
				var ads = _ads.default.getInstance();
				return ads.a9 && ads.currentAdsContext && ads.currentAdsContext.bidders && ads.currentAdsContext.bidders.a9Video;
			}
		}, {
			key: 'getAdsManagerConfig',
			value: function getAdsManagerConfig() {
				var bidParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				return {
					all_ads: _ads.default.getInstance().ooyalaAdSetProvider.get(1, null, {
						contentSourceId: this.params.dfpContentSourceId,
						videoId: this.params.videoId
					}, bidParams),
					useGoogleAdUI: true,
					useGoogleCountdown: false,
					onBeforeAdsManagerStart: function onBeforeAdsManagerStart(IMAAdsManager) {
						// mutes VAST ads from the very beginning
						// FIXME with VPAID it causes volume controls to be in incorrect state
						IMAAdsManager.setVolume(0);
					},

					onAdRequestSuccess: this.onAdRequestSuccess.bind(this)
				};
			}
		}, {
			key: 'onAdRequestSuccess',
			value: function onAdRequestSuccess(IMAAdsManager, uiContainer) {
				var _this2 = this;

				if (_ads.default.getInstance().currentAdsContext.opts.isMoatTrackingForFeaturedVideoEnabled) {
					(0, _moatVideoTracker.default)(IMAAdsManager, uiContainer, window.google.ima.ViewMode.NORMAL, 'ooyala', 'featured-video');
				}

				IMAAdsManager.addEventListener('loaded', function (eventData) {
					var adData = eventData.getAdData(),
					    currentAd = IMAAdsManager.getCurrentAd(),
					    adSet = _this2.params['google-ima-ads-manager'].all_ads;

					var wrapperCreativeId = void 0,
					    wrapperId = void 0;

					if (adData) {
						_this2.trackingParams.lineItemId = adData.adId;
						_this2.trackingParams.creativeId = adData.creativeId;
					}

					if (currentAd) {
						wrapperId = currentAd.getWrapperAdIds();
						if (wrapperId.length) {
							_this2.trackingParams.lineItemId = wrapperId[0];
						}

						wrapperCreativeId = currentAd.getWrapperCreativeIds();
						if (wrapperCreativeId.length) {
							_this2.trackingParams.creativeId = wrapperCreativeId[0];
						}
					}

					if (adSet && adSet[_this2.params.adIndex]) {
						_ads.default.getInstance().dispatchEvent('video.status', {
							vastUrl: adSet[_this2.params.adIndex].tag_url,
							creativeId: _this2.trackingParams.creativeId,
							lineItemId: _this2.trackingParams.lineItemId,
							status: 'success'
						});
					}
				});

				// that's a hack for autoplay on mobile for VPAID ads
				// VPAID ads still don't work perfectly
				var initiallyResumed = false;
				IMAAdsManager.addEventListener('pause', function (eventData) {
					if (eventData.getAd().getApiFramework() === 'VPAID') {
						if (!initiallyResumed) {
							IMAAdsManager.resume();
							// we don't use removeEventListener because it doesn't work as expected
							initiallyResumed = true;
						}
					}
				}, false, this);
			}
		}]);

		return OoyalaVideoAds;
	}();

	exports.default = OoyalaVideoAds;
});