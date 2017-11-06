define('mobile-wiki/components/trending-videos-item', ['exports', 'mobile-wiki/mixins/viewport', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/track'], function (exports, _viewport, _thumbnailer, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, {
		tagName: 'a',
		classNames: ['trending-videos-item'],
		attributeBindings: ['href'],
		thumbnailer: _thumbnailer.default,
		cropMode: _thumbnailer.default.mode.topCrop,
		imageStyle: null,
		video: null,
		imageWidth: 250,
		href: Ember.computed.oneWay('video.fileUrl'),

		imageHeight: Ember.computed('imageWidth', function () {
			return Math.floor(this.get('imageWidth') * 9 / 16);
		}),

		thumbUrl: Ember.computed('video.url', function () {
			var options = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: this.get('cropMode')
			},
			    videoUrl = this.get('video.url');

			if (videoUrl) {
				return this.thumbnailer.getThumbURL(videoUrl, options);
			} else {
				return undefined;
			}
		}),

		/**
   * @returns {boolean}
   */
		click: function click() {
			(0, _track.track)({
				action: _track.trackActions.click,
				category: 'main-page-trending-videos',
				label: 'open-item-' + this.get('index')
			});
			this.sendAction('action', this.get('video'));

			return false;
		}
	});
});