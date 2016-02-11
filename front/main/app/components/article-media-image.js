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
		classNameBindings: ['hasCaption', 'itemType', 'isSmall', 'isIcon', 'loaded'],
		tagName: 'figure',

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
				const thumbParams = this.getThumbnailParams(),
					thumbUrl = Thumbnailer.getThumbURL(url, thumbParams);

				this.hideBackgroundAfterImageIsLoaded(thumbUrl);

				return thumbUrl;
			} else {
				const width = this.get('width'),
					height = this.get('height');

				return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 ${width} ${height}'%2F%3E`;
			}
		}),

		isSmall: Ember.computed('width', 'height', function () {
			const imageWidth = this.get('width'),
				imageHeight = this.get('height');

			return imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;
		}),

		isIcon: Ember.computed.equal('mediaContext', 'icon'),

		hasCaption: Ember.computed.notEmpty('caption'),

		shouldDisplayCaption: Ember.computed('hasCaption', 'isIcon', function () {
			return this.get('hasCaption') && !this.get('isIcon');
		}),

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
		 * @param {string} url
		 * @returns {void}
		 */
		hideBackgroundAfterImageIsLoaded(url) {
			const image = new Image();

			image.src = url;
			image.onload = () => {
				if (!this.get('isDestroyed')) {
					this.set('loaded', true);
				}
			};
		},

		/**
		* @returns {{mode: string, height: number, width: number}}
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
