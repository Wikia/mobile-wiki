define('mobile-wiki/components/article-media-thumbnail', ['exports', 'ember-in-viewport', 'mobile-wiki/mixins/viewport', 'mobile-wiki/mixins/media-thumbnail-utils', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/thumbnail'], function (exports, _emberInViewport, _viewport, _mediaThumbnailUtils, _thumbnailer, _thumbnail) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var or = Ember.computed.or;
	var $ = Ember.$;
	var Component = Ember.Component;
	var computed = Ember.computed;
	exports.default = Component.extend(_emberInViewport.default, _mediaThumbnailUtils.default, _viewport.default, {
		classNames: ['article-media-thumbnail'],
		classNameBindings: ['itemType', 'isLoading', 'isSmall', 'isOgg'],
		tagName: 'figure',

		smallImageSize: {
			height: 64,
			width: 64
		},

		/**
   * Default is `article`
   * It can be overridden when rendering from another component, e.g. from article-media-gallery
   */
		itemContext: 'article',

		isOgg: computed('mime', function () {
			return this.get('mime') === 'application/ogg';
		}),

		itemType: computed('itemContext', 'type', function () {
			return this.get('itemContext') + '-' + this.get('type');
		}),

		/**
   * Check if image width is smaller than article container
   */
		isSmall: computed('width', 'height', function () {
			return this.get('width') <= this.get('viewportDimensions.width');
		}),

		hasFigcaption: or('caption', 'showTitle'),

		showTitle: computed('type', function () {
			return (this.get('type') === 'video' || this.get('isOgg')) && this.get('title');
		}),

		click: function click(event) {
			// Don't open lightbox when image is linked by user or caption was clicked
			if (!this.get('isLinkedByUser') && !$(event.target).closest('figcaption').length && !this.get('isOgg')) {
				// openLightbox is set in getAttributesForMedia() inside utils/article-media.js
				// it can also be overriden when this component is rendered from a template instead of JS
				this.get('openLightbox')(this.get('ref'));

				return false;
			}
		},


		/**
   * @returns {{mode: string, height: number, width: number}}
   */
		getThumbnailParams: function getThumbnailParams() {
			var originalWidth = this.get('width'),
			    originalHeight = this.get('height'),
			    mode = this.get('cropMode') || _thumbnailer.default.mode.thumbnailDown;

			var height = void 0,
			    width = void 0;

			if (this.get('isSmall')) {
				width = originalWidth;
				height = originalHeight;
			} else {
				width = this.get('forcedWidth') || (0, _thumbnail.normalizeThumbWidth)(this.get('viewportDimensions.width'));
				height = this.get('forcedHeight') || this.calculateHeightBasedOnWidth(originalWidth, originalHeight, width);
			}

			return { mode: mode, height: height, width: width };
		},


		/**
   * Keep the aspect ratio
   *
   * @param {number} originalWidth
   * @param {number} originalHeight
   * @param {number} width
   * @returns {number}
   */
		calculateHeightBasedOnWidth: function calculateHeightBasedOnWidth(originalWidth, originalHeight, width) {
			var scale = originalWidth / width;

			return Math.floor(originalHeight / scale);
		}
	});
});