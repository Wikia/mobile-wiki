'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ads = require('../ads');

var _ads2 = _interopRequireDefault(_ads);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _jwplayerVideoAds = require('./jwplayer-video-ads');

var _jwplayerVideoAds2 = _interopRequireDefault(_jwplayerVideoAds);

var _track2 = require('../app/utils/track');

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _jwplayerAssets = require('./jwplayer-assets');

var _jwplayerAssets2 = _interopRequireDefault(_jwplayerAssets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JWPlayer = function (_BasePlayer) {
	_inherits(JWPlayer, _BasePlayer);

	function JWPlayer(provider, params) {
		_classCallCheck(this, JWPlayer);

		var originalOnCreate = params.onCreate;

		var _this = _possibleConstructorReturn(this, (JWPlayer.__proto__ || Object.getPrototypeOf(JWPlayer)).call(this, provider, params));

		params.onCreate = function (bidParams, player) {
			var adsInstance = _ads2.default.getInstance();

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

		/**
		 * @returns {void}
		 */

	}, {
		key: 'createPlayer',
		value: function createPlayer() {
			var _this2 = this;

			_ads2.default.getInstance().waitForReady().then(function () {
				return new _jwplayerVideoAds2.default(_this2.params).getConfig();
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
					comscore: _environment2.default.environment === 'production'
				},
				settings: {
					showAutoplayToggle: true,
					showCaptionsToggle: true
				},
				captions: {
					enabled: this.params.captions
				},
				autoplay: this.params.autoplay,
				mute: this.params.autoplay,
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
				},
				lang: this.params.lang
			}, this.params.onCreate.bind(this, bidParams));
		}

		/**
		 * @return {void}
		 */

	}, {
		key: 'loadPlayer',
		value: function loadPlayer() {
			var _this3 = this;

			_jwplayerAssets2.default.load().then(function () {
				_this3.playerDidLoad();
			});
		}

		/**
		 * @returns {void}
		 */

	}, {
		key: 'playerDidLoad',
		value: function playerDidLoad() {
			this.createPlayer();
		}
	}]);

	return JWPlayer;
}(_base2.default);

window.JWPlayer = JWPlayer;
