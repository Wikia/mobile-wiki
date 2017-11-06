define('mobile-wiki/modules/video-loader', ['exports', 'mobile-wiki/modules/video-players/base', 'mobile-wiki/modules/video-players/ooyala', 'mobile-wiki/modules/video-players/ooyala-v4', 'mobile-wiki/modules/video-players/youtube', 'mobile-wiki/modules/video-players/jwplayer'], function (exports, _base, _ooyala, _ooyalaV, _youtube, _jwplayer) {
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

	var playerClassMap = {
		base: _base.default,
		ooyala: _ooyala.default,
		'ooyala-v4': _ooyalaV.default,
		youtube: _youtube.default,
		jwplayer: _jwplayer.default
	};

	/**
  * @class VideoLoader
  */

	var VideoLoader = function () {
		/**
   * @param {*} data
   * @returns {void}
   */
		function VideoLoader(data) {
			_classCallCheck(this, VideoLoader);

			this.data = data;
		}

		/**
   * @returns {boolean}
   */


		_createClass(VideoLoader, [{
			key: 'isOoyalaV3',
			value: function isOoyalaV3() {
				// We need to use regexp check because Ooyala provider name may contain 'ooyala/funimation' or
				// other similar
				return Boolean(this.data.provider.toLowerCase().match(/ooyala/)) && this.data.provider !== 'ooyala-v4';
			}
		}, {
			key: 'loadPlayerClass',
			value: function loadPlayerClass() {
				var provider = this.getProviderName(),
				    playerClass = VideoLoader.getPlayerClassBasedOnProvider(provider),
				    params = $.extend(this.data.jsParams, {
					size: {
						height: this.data.height,
						width: this.data.width
					},
					noAds: this.data.noAds
				});

				this.player = VideoLoader.createPlayer(playerClass, provider, params);
				this.player.setupPlayer();
				this.player.onResize();
			}
		}, {
			key: 'getProviderName',
			value: function getProviderName() {
				return this.isOoyalaV3() ? 'ooyala' : this.data.provider;
			}
		}, {
			key: 'onResize',
			value: function onResize() {
				this.player.onResize();
			}
		}], [{
			key: 'createPlayer',
			value: function createPlayer(playerClass, provider, params) {
				return new playerClass(provider, params);
			}
		}, {
			key: 'getPlayerClassBasedOnProvider',
			value: function getPlayerClassBasedOnProvider(provider) {
				if (playerClassMap.hasOwnProperty(provider)) {
					return playerClassMap[provider];
				} else {
					return playerClassMap.base;
				}
			}
		}]);

		return VideoLoader;
	}();

	exports.default = VideoLoader;
});