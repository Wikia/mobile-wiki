define('mobile-wiki/modules/video-players/ooyala-v4', ['exports', 'mobile-wiki/modules/ads', 'mobile-wiki/modules/video-players/base', 'mobile-wiki/modules/video-players/ooyala-video-ads', 'mobile-wiki/config/environment'], function (exports, _ads, _base, _ooyalaVideoAds, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ooyalaAssets = undefined;

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

	var ooyalaAssets = exports.ooyalaAssets = {
		styles: ['/mobile-wiki/assets/ooyala/html5-skin.css', '/mobile-wiki/assets/ooyala.css'],
		script: '/mobile-wiki/assets/ooyala/all.js'
	};

	var OoyalaV4Player = function (_BasePlayer) {
		_inherits(OoyalaV4Player, _BasePlayer);

		/**
   * @param {string} provider
   * @param {*} params
   * @returns {void}
   */
		function OoyalaV4Player(provider, params) {
			_classCallCheck(this, OoyalaV4Player);

			var ooyalaPCode = _environment.default.ooyala.pcode;
			var ooyalaPlayerBrandingId = _environment.default.ooyala.playerBrandingId;
			var skinConfigUrl = '/wikia.php?controller=OoyalaConfig&method=skin&isMobile=1&cb=' + params.cacheBuster;
			var originalOnCreate = params.onCreate;

			params.pcode = ooyalaPCode;
			params.playerBrandingId = ooyalaPlayerBrandingId;
			if (!params.skin) {
				params.skin = {};
			}
			params.skin.config = skinConfigUrl;

			var _this = _possibleConstructorReturn(this, (OoyalaV4Player.__proto__ || Object.getPrototypeOf(OoyalaV4Player)).call(this, provider, params));

			_this.adTrackingParams = params.adTrackingParams || {};

			params.onCreate = function (player) {
				originalOnCreate(player);

				_ads.default.getInstance().registerOoyalaTracker(player, _this.adTrackingParams);
				player.mb.subscribe(window.OO.EVENTS.ADS_PLAYED, 'video-tracker', function () {
					_this.params.adIndex += 1;
				});
			};

			_this.containerId = params.containerId;
			return _this;
		}

		/**
   * @returns {void}
   */


		_createClass(OoyalaV4Player, [{
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

				window.OO.ready(function () {
					_ads.default.getInstance().waitForReady().then(function () {
						_ads.default.getInstance().trackOoyalaEvent(_this2.adTrackingParams, 'init');
						return new _ooyalaVideoAds.default(_this2.params, _this2.adTrackingParams).getOoyalaConfig();
					}).then(function (params) {
						return window.OO.Player.create(_this2.containerId, _this2.params.videoId, params);
					});
				});
			}
		}, {
			key: 'loadPlayer',
			value: function loadPlayer() {
				this.loadStyles(ooyalaAssets.styles);
				this.loadScripts(ooyalaAssets.script, this.playerDidLoad.bind(this));
			}
		}, {
			key: 'loadStyles',
			value: function loadStyles(cssFiles) {
				var html = cssFiles.map(function (url) {
					return '<link rel="stylesheet" href="' + url + '" crossorigin="anonymous">';
				}).join('');

				$(html).appendTo('head');
			}
		}, {
			key: 'loadScripts',
			value: function loadScripts(jsFile, callback) {
				$script(jsFile, function () {
					callback();
				});
			}
		}, {
			key: 'playerDidLoad',
			value: function playerDidLoad() {
				this.createPlayer();
			}
		}]);

		return OoyalaV4Player;
	}(_base.default);

	exports.default = OoyalaV4Player;
});