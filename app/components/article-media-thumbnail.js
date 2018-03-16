import {or, equal, lte} from '@ember/object/computed';
import {inject as service} from '@ember/service';
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
		lightbox: service(),

		classNames: ['article-media-thumbnail'],
		classNameBindings: ['itemType', 'isLoading', 'isSmall', 'isOgg'],
		tagName: 'figure',

		/**
		 * Default is `article`
		 * It can be overridden when rendering from another component, e.g. from article-media-gallery
		 */
		itemContext: 'article',

		hasFigcaption: or('model.caption', 'showTitle'),
		isVideo: equal('type', 'video'),

		isOgg: equal('model.mime', 'application/ogg'),

		/**
		 * Check if image width is smaller than article container
		 */
		isSmall: computed('model.width', function () {
			return this.get('model.width') <= this.get('viewportWidth');
		}),

		itemType: computed('itemContext', 'model.type', function () {
			return `${this.get('itemContext')}-${this.get('model.type')}`;
		}),

		viewportWidth: computed(() => {
			return typeof Fastboot !== 'undefined' ? null : document.documentElement.clientWidth;
		}),

		showTitle: computed('model.type', function () {
			return (this.get('model.type') === 'video' || this.get('model.isOgg')) && this.get('model.title');
		}),

		click(event) {
			// Don't open lightbox when image is linked by user or caption was clicked
			if (!this.get('model.isLinkedByUser') && !event.target.closest('figcaption') && !this.get('isOgg')) {
				this.get('lightbox').open('media', this.get('model'));

				return false;
			}
		},

		/**
		 * @returns {{mode: string, height: number, width: number}}
		 */
		getThumbnailParams() {
			const originalWidth = this.get('model.width'),
				originalHeight = this.get('model.height'),
				mode = this.get('model.cropMode') || Thumbnailer.mode.thumbnailDown;

			let height,
				width;

			if (this.get('isSmall')) {
				width = originalWidth;
				height = originalHeight;
			} else {
				width = this.get('forcedWidth') || normalizeThumbWidth(this.get('viewportWidth'));
				height = this.get('forcedHeight') || this.calculateHeightBasedOnWidth(originalWidth, originalHeight, width);
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
