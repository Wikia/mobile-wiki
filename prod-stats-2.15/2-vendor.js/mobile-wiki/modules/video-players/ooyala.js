define('mobile-wiki/modules/video-players/ooyala', ['exports', 'mobile-wiki/modules/ads', 'mobile-wiki/modules/video-players/base', 'mobile-wiki/utils/track'], function (exports, _ads, _base, _track) {
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

	var OoyalaPlayer = function (_BasePlayer) {
		_inherits(OoyalaPlayer, _BasePlayer);

		/**
   * @param {string} provider
   * @param {*} params
   * @returns {void}
   */
		function OoyalaPlayer(provider, params) {
			_classCallCheck(this, OoyalaPlayer);

			var _this = _possibleConstructorReturn(this, (OoyalaPlayer.__proto__ || Object.getPrototypeOf(OoyalaPlayer)).call(this, provider, params));

			_this.started = false;
			_this.ended = false;

			// a bit ambiguous based on legacy return, but the first file is the
			// Ooyala embedded API, the second is AgeGate
			_this.resourceURI = params.jsFile[0];

			// Ooyala JSON payload contains a DOM id
			_this.containerId = _base.default.createUniqueId(params.playerId);
			_this.containerSelector = '#' + _this.containerId;
			return _this;
		}

		/**
   * @returns {void}
   */


		_createClass(OoyalaPlayer, [{
			key: 'setupPlayer',
			value: function setupPlayer() {
				if (!window.OO) {
					this.loadPlayer();
				} else {
					this.createPlayer();
				}
			}
		}, {
			key: 'createPlayer',
			value: function createPlayer() {
				var _this2 = this;

				_ads.default.getInstance().onReady(function () {
					var size = _this2.params.size || {},
					    vastUrl = _ads.default.getInstance().buildVastUrl(size.width / size.height, {
						passback: 'ooyala',
						pos: 'ooyala',
						src: 'gpt'
					}, {
						contentSourceId: _this2.params.dfpContentSourceId,
						videoId: _this2.params.videoId
					});

					_this2.params.onCreate = function () {
						return _this2.onCreate.apply(_this2, arguments);
					};

					if (!_this2.params.noAds) {
						_this2.params['google-ima-ads-manager'] = {
							adTagUrl: vastUrl
						};
					}

					window.OO.Player.create(_this2.containerId, _this2.params.videoId, _this2.params);
				});
			}
		}, {
			key: 'playerDidLoad',
			value: function playerDidLoad() {
				this.createPlayer();
			}
		}, {
			key: 'onCreate',
			value: function onCreate(player) {
				var _this3 = this;

				var messageBus = player.mb;

				// Player has loaded
				messageBus.subscribe(window.OO.EVENTS.PLAYER_CREATED, 'tracking', function () {
					_this3.track(_track.trackActions.success, 'player-load');
				});

				// Actual content starts playing (past any ads or age-gates)
				messageBus.subscribe(window.OO.EVENTS.PLAYING, 'tracking', function () {
					if (!_this3.started) {
						_this3.track(_track.trackActions.playVideo, 'content-begin');
						_this3.started = true;
					}
				});

				// Ad starts
				messageBus.subscribe(window.OO.EVENTS.WILL_PLAY_ADS, 'tracking', function () {
					_this3.track(_track.trackActions.view, 'ad-start');
				});

				// Ad has been fully watched
				messageBus.subscribe(window.OO.EVENTS.ADS_PLAYED, 'tracking', function () {
					_this3.track(_track.trackActions.success, 'ad-finish');
				});
			}
		}]);

		return OoyalaPlayer;
	}(_base.default);

	exports.default = OoyalaPlayer;
});