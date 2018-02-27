import {or, equal} from '@ember/object/computed';
import Component from '@ember/component';
import {computed} from '@ember/object';
import InViewportMixin from 'ember-in-viewport';
import MediaThumbnailUtilsMixin from '../mixins/media-thumbnail-utils';
import Thumbnailer from '../modules/thumbnailer';
import {normalizeThumbWidth} from '../utils/thumbnail';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
	RenderComponentMixin,
	InViewportMixin,
	MediaThumbnailUtilsMixin,
	{
		classNames: ['article-media-thumbnail'],
		classNameBindings: ['itemType', 'isLoading', 'isSmall', 'isOgg'],
		tagName: 'figure',

		/**
		 * Default is `article`
		 * It can be overridden when rendering from another component, e.g. from article-media-gallery
		 */
		itemContext: 'article',

		hasFigcaption: or('caption', 'showTitle'),
		isVideo: equal('type', 'video'),

		isOgg: computed('mime', function () {
			return this.get('mime') === 'application/ogg';
		}),

		itemType: computed('itemContext', 'type', function () {
			return `${this.get('itemContext')}-${this.get('type')}`;
		}),

		viewportWidth: computed(() => {
			return typeof Fastboot !== 'undefined' ? null : document.documentElement.clientWidth;
		}),

		/**
		 * Check if image width is smaller than article container
		 */
		isSmall: computed('width', 'height', function () {
			return this.get('width') <= this.get('viewportWidth');
		}),

		showTitle: computed('type', function () {
			return (this.get('type') === 'video' || this.get('isOgg')) && this.get('title');
		}),

		click(event) {
			// Don't open lightbox when image is linked by user or caption was clicked
			if (!this.get('isLinkedByUser') && !event.target.closest('figcaption') && !this.get('isOgg')) {
				// openLightbox is set in getAttributesForMedia() inside utils/article-media.js
				// it can also be overriden when this component is rendered from a template instead of JS
				// TODO: fix it
				this.get('openLightbox')(this.get('ref'));

				return false;
			}
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
				width = this.get('forcedWidth') || normalizeThumbWidth(this.get('viewportWidth'));
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
		}
	}
);
