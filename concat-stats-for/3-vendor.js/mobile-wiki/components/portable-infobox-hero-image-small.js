define('mobile-wiki/components/portable-infobox-hero-image-small', ['exports', 'mobile-wiki/modules/hero-image', 'mobile-wiki/mixins/viewport', 'mobile-wiki/mixins/image-loader'], function (exports, _heroImage, _viewport, _imageLoader) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var computed = Ember.computed;
	var Component = Ember.Component;
	exports.default = Component.extend(_viewport.default, _imageLoader.default, {
		isLoading: true,

		maxWidth: computed('viewportDimensions.width', function () {
			return Math.round(this.get('viewportDimensions.width') * 0.7);
		}),

		heroImageHelper: computed('heroImage', 'maxWidth', function () {
			var heroImage = this.get('heroImage'),
			    maxWidth = this.get('maxWidth');

			return new _heroImage.default(heroImage, maxWidth);
		}),

		imageSrc: computed('isLoading', function () {
			if (this.get('isLoading')) {
				return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\' viewBox%3D\'0 0 ' + this.get('maxWidth') + ' ' + this.get('heroImageHelper.computedHeight') + '\'%2F%3E'; // eslint-disable-line max-len
			}
			return this.get('heroImageHelper.thumbnailUrl');
		}),

		init: function init() {
			var _this = this;

			this._super.apply(this, arguments);
			this.load(this.get('heroImageHelper.thumbnailUrl')).then(function () {
				_this.set('isLoading', false);
			}).catch(function () {
				_this.set('isLoading', false);
			});
		},


		actions: {
			openLightbox: function openLightbox() {
				this.openLightbox('image', { url: this.get('heroImage.url') });
			}
		}
	});
});