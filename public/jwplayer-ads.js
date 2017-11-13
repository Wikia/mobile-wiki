'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ads = require('../ads');

var _ads2 = _interopRequireDefault(_ads);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JWPlayerVideoAds = function () {
	function JWPlayerVideoAds(params) {
		_classCallCheck(this, JWPlayerVideoAds);

		this.params = params;
	}

	_createClass(JWPlayerVideoAds, [{
		key: 'getConfig',
		value: function getConfig() {
			if (this.params.noAds) {
				return Promise.resolve(this.params);
			} else if (this.isA9VideoEnabled()) {
				return this.parseBidderParameters()
				/* eslint no-console: 0 */
				.catch(function (error) {
					return console.error('JWPlayer: Error while receiving bidder parameters', error);
				});
			} else {
				return Promise.resolve({});
			}
		}
	}, {
		key: 'parseBidderParameters',
		value: function parseBidderParameters() {
			var a9 = _ads2.default.getInstance().a9;

			if (!a9) {
				return Promise.resolve({});
			}

			return a9.waitForResponse().then(function () {
				return a9.getSlotParams('FEATURED');
			});
		}
	}, {
		key: 'isA9VideoEnabled',
		value: function isA9VideoEnabled() {
			var ads = _ads2.default.getInstance();

			return ads.a9 && ads.currentAdsContext && ads.currentAdsContext.bidders && ads.currentAdsContext.bidders.a9Video;
		}
	}]);

	return JWPlayerVideoAds;
}();

window.JWPlayerVideoAds = JWPlayerVideoAds;
