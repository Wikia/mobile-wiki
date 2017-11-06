define('mobile-wiki/modules/video-players/base', ['exports', 'mobile-wiki/utils/calculation', 'mobile-wiki/utils/track'], function (exports, _calculation, _track2) {
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

	var BasePlayer = function () {
		/**
   * @param {string} provider
   * @param {*} params
   * @returns {void}
   */
		function BasePlayer(provider, params) {
			_classCallCheck(this, BasePlayer);

			if (!provider) {
				throw new Error('VideoPlayer requires a provider as the first argument');
			}
			this.provider = provider;
			this.params = params;
			this.id = params.videoId;
			this.videoWidth = params.size.width;
			this.videoHeight = params.size.height;
			// Most common video container selector
			this.containerSelector = '.lightbox-content-inner > iframe';
			this.params.adIndex = 0;
		}

		/**
   * @returns {void}
   */


		_createClass(BasePlayer, [{
			key: 'setupPlayer',
			value: function setupPlayer() {}
		}, {
			key: 'loadPlayer',
			value: function loadPlayer() {
				var _this = this;

				return $script(this.resourceURI, function () {
					// called once player is loaded
					_this.playerDidLoad();
				});
			}
		}, {
			key: 'playerDidLoad',
			value: function playerDidLoad() {}
		}, {
			key: 'onResize',
			value: function onResize() {
				var containerSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.containerSelector;

				var $container = $(containerSelector),
				    $lightbox = $('.lightbox-wrapper'),
				    lightboxWidth = $lightbox.width(),
				    lightboxHeight = $lightbox.height(),
				    targetSize = (0, _calculation.default)(lightboxWidth, lightboxHeight, this.videoWidth, this.videoHeight);

				var sanitizedSize = void 0;

				// sanitize as our backend sometimes returns size of 0x0
				if (targetSize.width > 0 && targetSize.height > 0) {
					sanitizedSize = {
						width: targetSize.width,
						height: targetSize.height
					};
				} else {
					sanitizedSize = {
						width: '100%',
						height: '100%'
					};
				}

				$container.css(sanitizedSize);
			}
		}, {
			key: 'track',
			value: function track(action, event) {
				return (0, _track2.track)({
					action: action,
					category: 'video-player-' + event,
					label: this.provider
				});
			}
		}], [{
			key: 'createUniqueId',
			value: function createUniqueId(id) {
				var element = document.getElementById(id),
				    newId = id + new Date().getTime();

				if (element) {
					element.id = newId;
				}

				return newId;
			}
		}]);

		return BasePlayer;
	}();

	exports.default = BasePlayer;
});