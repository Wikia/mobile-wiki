import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import ArticleContentMixin from '../mixins/article-content';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend(
	ArticleContentMixin,
	InViewportMixin,
	{
		attributeBindings: ['data-ref'],
		classNames: ['article-media-image'],
		classNameBindings: ['itemType', 'isSmall', 'isIcon', 'shouldBeLoaded:loaded'],
		tagName: 'figure',

		'data-ref': Ember.computed.oneWay('ref'),

		emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
		smallImageSize: {
			height: 64,
			width: 64,
		},

		itemType: Ember.computed('type', function () {
			return `article-${this.get('type')}`;
		}),

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

		isSmall: Ember.computed('media.width', 'media.height', function () {
			const imageWidth = this.get('media.width'),
				imageHeight = this.get('media.height');

			return imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;
		}),

		isIcon: Ember.computed.equal('media.context', 'icon'),

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

		didEnterViewport() {
			this.set('shouldBeLoaded', true);
		},

		/**
		* @returns {{mode: string, width: number, height: number}}
		*/
		getThumbnailParams() {
			const articleWidth = this.get('articleContent.width'),
				mode = this.get('cropMode') || Thumbnailer.mode.thumbnailDown,
				width = this.get('forceWidth') || articleWidth,
				height = this.get('forceHeight') || this.calculateHeightBasedOnWidth(
						this.get('width'), this.get('height'), width
					);

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
	});
