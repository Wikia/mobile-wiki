define('mobile-wiki/modules/video-players/youtube', ['exports', 'mobile-wiki/modules/video-players/base', 'mobile-wiki/utils/track'], function (exports, _base, _track) {
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

	var YouTubePlayer = function (_BasePlayer) {
		_inherits(YouTubePlayer, _BasePlayer);

		/**
   * @param {string} provider
   * @param {*} params
   * @returns {void}
   */
		function YouTubePlayer(provider, params) {
			_classCallCheck(this, YouTubePlayer);

			var _this = _possibleConstructorReturn(this, (YouTubePlayer.__proto__ || Object.getPrototypeOf(YouTubePlayer)).call(this, provider, params));

			_this.started = false;
			_this.ended = false;

			_this.resourceURI = 'https://www.youtube.com/iframe_api';
			_this.containerId = _base.default.createUniqueId('youtubeVideoPlayer');
			return _this;
		}

		/**
   * @returns {void}
   */


		_createClass(YouTubePlayer, [{
			key: 'setupPlayer',
			value: function setupPlayer() {
				var _this2 = this;

				this.params.events = {
					onReady: function onReady() {
						return _this2.onPlayerReady.apply(_this2, arguments);
					},
					onStateChange: function onStateChange() {
						return _this2.onPlayerStateChange.apply(_this2, arguments);
					}
				};

				if (window.YT) {
					this.createPlayer();
				} else {
					window.onYouTubeIframeAPIReady = function () {
						_this2.createPlayer();
					};
					this.loadPlayer();
				}
			}
		}, {
			key: 'createPlayer',
			value: function createPlayer() {
				this.player = new window.YT.Player(this.containerId, this.params);
			}
		}, {
			key: 'onPlayerReady',
			value: function onPlayerReady() {
				this.onResize();
				this.track(_track.trackActions.success, 'player-loaded');
			}
		}, {
			key: 'onPlayerStateChange',
			value: function onPlayerStateChange(event) {
				if (!this.started && event.data === 1) {
					this.track(_track.trackActions.playVideo, 'content-begin');
					this.started = true;
				}

				if (!this.ended && event.data === 0) {
					this.track(_track.trackActions.success, 'content-end');
					this.ended = true;
				}
			}
		}]);

		return YouTubePlayer;
	}(_base.default);

	exports.default = YouTubePlayer;
});