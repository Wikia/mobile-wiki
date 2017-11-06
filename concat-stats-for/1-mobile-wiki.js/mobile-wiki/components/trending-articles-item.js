define('mobile-wiki/components/trending-articles-item', ['exports', 'mobile-wiki/mixins/viewport', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/track'], function (exports, _viewport, _thumbnailer, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, {
		tagName: 'a',
		classNames: ['trending-articles-item'],
		attributeBindings: ['href', 'style'],
		cropMode: _thumbnailer.default.mode.topCrop,
		thumbnailer: _thumbnailer.default,
		style: null,
		imageWidth: 250,
		href: Ember.computed.oneWay('url'),

		currentlyRenderedImageUrl: Ember.computed('imageUrl', function () {
			if (this.get('imageUrl')) {
				var options = {
					width: this.get('imageWidth'),
					height: this.get('imageHeight'),
					mode: this.get('cropMode')
				};

				return this.thumbnailer.getThumbURL(this.get('imageUrl'), options);
			} else {
				return undefined;
			}
		}),

		imageHeight: Ember.computed('imageWidth', function () {
			return Math.floor(this.get('imageWidth') * 9 / 16);
		}),

		/**
   * @returns {void}
   */
		click: function click() {
			(0, _track.track)({
				action: _track.trackActions.click,
				category: 'main-page-trending-articles',
				label: 'open-item-' + this.get('index')
			});
		}
	});
});