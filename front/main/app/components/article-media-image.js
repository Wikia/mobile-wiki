import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import ArticleContentMixin from '../mixins/article-content';
import Thumbnailer from 'common/modules/Thumbnailer';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	ArticleContentMixin,
	InViewportMixin,
	{
		attributeBindings: ['data-ref'],
		classNames: ['article-media-image'],
		classNameBindings: ['hasCaption', 'itemType', 'isSmall', 'isIcon', 'shouldBeLoaded:loaded'],
		tagName: 'figure',

		emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',

		smallImageSize: {
			height: 64,
			width: 64
		},

		iconHeight: 20,
		iconWidth: Ember.computed('iconHeight', function () {
			const width = this.get('width'),
				height = this.get('height'),
				iconHeight = this.get('iconHeight');

			return Math.floor(iconHeight * width / height);
		}),

		/**
		 * Default is `article`
		 * It can be overridden when rendering from another component, e.g. from article-media-gallery
		 */
		itemContext: 'article',

		itemType: Ember.computed('itemContext', 'type', function () {
			return `${this.get('itemContext')}-${this.get('type')}`;
		}),

		// Needed for lightbox, should be refactored
		'data-ref': Ember.computed.oneWay('ref'),

		thumbnailUrl: Ember.computed('url', 'shouldBeLoaded', function () {
			const url = this.get('url');

			if (url && this.get('shouldBeLoaded')) {
				const {mode, width, height} = this.getThumbnailParams();

				return Thumbnailer.getThumbURL(url, {
					mode,
					height,
					width
				});
			} else {
				return this.emptyGif;
			}
		}),

		isSmall: Ember.computed('width', 'height', function () {
			const imageWidth = this.get('width'),
				imageHeight = this.get('height');

			return imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;
		}),

		isIcon: Ember.computed.equal('mediaContext', 'icon'),

		hasCaption: Ember.computed.notEmpty('caption'),

		viewportOptionsOverride: Ember.on('didInsertElement', function () {
			Ember.setProperties(this, {
				viewportTolerance: {
					top: 400,
					bottom: 400,
					left: 200,
					right: 200
				}
			});
		}),

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			this.set('shouldBeLoaded', true);
		},

		actions: {
			/**
			 * @returns {void}
			 */
			clickLinkedImage() {
				track({
					action: trackActions.click,
					category: 'linked-image'
				});
			}
		},

		/**
		* @returns {{mode: string, width: number, height: number}}
		*/
		getThumbnailParams() {
			const originalWidth = this.get('width'),
				originalHeight = this.get('height');

			let mode,
				height,
				width;

			if (this.get('isIcon')) {
				mode = Thumbnailer.mode.scaleToWidth;
				width = this.get('iconWidth');
			} else if (this.get('isSmall')) {
				mode = Thumbnailer.mode.thumbnailDown;
				width = originalWidth;
				height = originalHeight;
			} else {
				mode = this.get('cropMode') || Thumbnailer.mode.thumbnailDown;
				width = this.get('forceWidth') || this.get('articleContent.width');
				height = this.get('forceHeight') ||
					this.calculateHeightBasedOnWidth(originalWidth, originalHeight, width);
			}

			return {mode, width, height};
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
			const aspectRatio = originalWidth / originalHeight;

			return Math.floor(width * aspectRatio);
		},

		/**
		 * Normalize image width used to generate a thumbnail
		 * so we don't pollute the cache with multiple thumbs for every device width
		 *
		 * @param {number} width
		 * @returns {number}
		 */
		normalizeThumbWidth(width) {
			const thumbSize = {
				small: 340,
				medium: 660,
				large: 900
			};

			if (width <= thumbSize.small) {
				return thumbSize.small;
			} else if (width <= thumbSize.medium) {
				return thumbSize.medium;
			}

			return thumbSize.large;
		},
	}
);
