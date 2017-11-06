define('mobile-wiki/modules/video-players/jwplayer', ['exports', 'mobile-wiki/modules/ads', 'mobile-wiki/modules/video-players/base', 'mobile-wiki/modules/video-players/jwplayer-video-ads', 'mobile-wiki/utils/track', 'mobile-wiki/config/environment'], function (exports, _ads, _base, _jwplayerVideoAds, _track2, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.jwPlayerAssets = undefined;

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

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var jwPlayerAssets = exports.jwPlayerAssets = {
		styles: '/mobile-wiki/assets/jwplayer/index.css',
		script: '/mobile-wiki/assets/jwplayer/wikiajwplayer.js'
	};

	var JWPlayer = function (_BasePlayer) {
		_inherits(JWPlayer, _BasePlayer);

		function JWPlayer(provider, params) {
			_classCallCheck(this, JWPlayer);

			var originalOnCreate = params.onCreate;

			var _this = _possibleConstructorReturn(this, (JWPlayer.__proto__ || Object.getPrototypeOf(JWPlayer)).call(this, provider, params));

			params.onCreate = function (bidParams, player) {
				var adsInstance = _ads.default.getInstance();

				originalOnCreate(player);

				if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
					adsInstance.jwPlayerAds(player, bidParams);
					adsInstance.jwPlayerMoat(player);
				}
			};

			_this.adTrackingParams = params.adTrackingParams || {};
			return _this;
		}

		_createClass(JWPlayer, [{
			key: 'setupPlayer',
			value: function setupPlayer() {
				if (!window.wikiaJWPlayer) {
					this.loadPlayer();
				} else {
					this.createPlayer();
				}
			}
		}, {
			key: 'createPlayer',
			value: function createPlayer() {
				var _this2 = this;

				_ads.default.getInstance().waitForReady().then(function () {
					return new _jwplayerVideoAds.default(_this2.params).getConfig();
				}).then(this.initializePlayer.bind(this));
			}
		}, {
			key: 'initializePlayer',
			value: function initializePlayer(bidParams) {
				window.wikiaJWPlayer(this.params.containerId, {
					tracking: {
						track: function track(data) {
							data.trackingMethod = 'both';

							(0, _track2.track)(data);
						},

						setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
						comscore: _environment.default.environment === 'production'
					},
					autoplay: {
						enabled: this.params.autoplay
					},
					related: {
						time: 3,
						playlistId: this.params.recommendedVideoPlaylist || 'Y2RWCKuS',
						autoplay: true
					},
					videoDetails: {
						description: this.params.playlist[0].description,
						title: this.params.playlist[0].title,
						playlist: this.params.playlist
					},
					logger: {
						clientName: 'mobile-wiki'
					}
				}, this.params.onCreate.bind(this, bidParams));
			}
		}, {
			key: 'loadPlayer',
			value: function loadPlayer() {
				this.loadStyles(jwPlayerAssets.styles);
				this.loadScripts(jwPlayerAssets.script, this.playerDidLoad.bind(this));
			}
		}, {
			key: 'loadStyles',
			value: function loadStyles(cssFile) {
				$('<link rel="stylesheet" href="' + cssFile + '" crossorigin="anonymous">').appendTo('head');
			}
		}, {
			key: 'loadScripts',
			value: function loadScripts(jsFile, callback) {
				window.M.loadScript(jsFile, true, callback, 'anonymous');
			}
		}, {
			key: 'playerDidLoad',
			value: function playerDidLoad() {
				this.createPlayer();
			}
		}]);

		return JWPlayer;
	}(_base.default);

	exports.default = JWPlayer;
});