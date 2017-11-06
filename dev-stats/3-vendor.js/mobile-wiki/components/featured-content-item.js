define('mobile-wiki/components/featured-content-item', ['exports', 'mobile-wiki/mixins/curated-content-thumbnail', 'mobile-wiki/mixins/viewport', 'mobile-wiki/modules/thumbnailer'], function (exports, _curatedContentThumbnail, _viewport, _thumbnailer) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_curatedContentThumbnail.default, _viewport.default, {
		tagName: 'a',
		attributeBindings: ['href', 'style'],
		classNames: ['featured-content-item'],
		href: Ember.computed.oneWay('model.url'),

		aspectRatio: 16 / 9,
		imageWidth: 400,
		cropMode: _thumbnailer.default.mode.zoomCrop,
		thumbUrl: Ember.computed('model', function () {
			var imageUrl = this.get('model.imageUrl');

			if (imageUrl) {
				return this.generateThumbUrl(imageUrl, this.get('model.imageCrop.' + this.get('aspectRatioName')));
			}

			return this.get('emptyGif');
		})
	});
});