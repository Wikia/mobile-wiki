import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import ArticleContentMixin from '../mixins/article-content';
import MediaThumbnailUtilsMixin from '../mixins/media-thumbnail-utils';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend(
	ArticleContentMixin,
	InViewportMixin,
	MediaThumbnailUtilsMixin,
	{
		attributeBindings: ['data-ref', 'data-gallery-ref'],
		classNames: ['article-media-thumbnail'],
		classNameBindings: ['itemType', 'isLoading', 'isSmall'],
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

		itemType: Ember.computed('itemContext', 'type', function () {
			return `${this.get('itemContext')}-${this.get('type')}`;
		}),

		// Needed for lightbox, should be refactored
		'data-ref': Ember.computed.readOnly('ref'),
		'data-gallery-ref': Ember.computed.readOnly('galleryRef'),

		/**
		 * Check if image width is smaller than article container
		 */
		isSmall: Ember.computed('width', 'height', function () {
			return this.get('width') <= this.get('articleContent.width');
		}),

		hasFigcaption: Ember.computed.or('caption', 'showTitle'),

		showTitle: Ember.computed('type', function () {
			return this.get('type') === 'video' && this.get('title');
		}),

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
				width = this.get('forcedWidth') || this.normalizeThumbWidth(this.get('articleContent.width'));
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
