import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import ViewportMixin from '../mixins/viewport';
import MediaThumbnailUtilsMixin from '../mixins/media-thumbnail-utils';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend(
	InViewportMixin,
	MediaThumbnailUtilsMixin,
	ViewportMixin,
	{
		classNames: ['article-media-thumbnail'],
		classNameBindings: ['itemType', 'isLoading', 'isSmall'],
		tagName: 'figure',

		layoutName: 'components/article-media-thumbnail',

		smallImageSize: {
			height: 64,
			width: 64
		},

		/**
		 * Default is `article`
		 * It can be overridden when rendering from another component, e.g. from article-media-gallery
		 */
		itemContext: 'article',

		itemType: Ember.computed('itemContext', 'type', function () {
			return `${this.get('itemContext')}-${this.get('type')}`;
		}),

		/**
		 * Check if image width is smaller than article container
		 */
		isSmall: Ember.computed('width', 'height', function () {
			return this.get('width') <= this.get('viewportDimensions.width');
		}),

		hasFigcaption: Ember.computed.or('caption', 'showTitle'),

		showTitle: Ember.computed('type', function () {
			return this.get('type') === 'video' && this.get('title');
		}),

		click() {
			this.get('openLightbox')();
		},

		/**
		* @returns {{mode: string, height: number, width: number}}
		*/
		getThumbnailParams() {
			const originalWidth = this.get('width'),
				originalHeight = this.get('height'),
				mode = this.get('cropMode') || Thumbnailer.mode.thumbnailDown;

			let height,
				width;

			if (this.get('isSmall')) {
				width = originalWidth;
				height = originalHeight;
			} else {
				width = this.get('forcedWidth') || this.normalizeThumbWidth(this.get('viewportDimensions.width'));
				height = this.get('forcedHeight') ||
					this.calculateHeightBasedOnWidth(originalWidth, originalHeight, width);
			}

			return {mode, height, width};
		},

		/**
		 * Keep the aspect ratio
		 *
		 * @param {number} originalWidth
		 * @param {number} originalHeight
		 * @param {number} width
		 * @returns {number}
		 */
		calculateHeightBasedOnWidth(originalWidth, originalHeight, width) {
			const scale = originalWidth / width;

			return Math.floor(originalHeight / scale);
		},
	}
);
