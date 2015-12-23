import Ember from 'ember';
import VisibleMixin from '../mixins/visible';
import Thumbnailer from '../../mercury/modules/Thumbnailer';
import {track, trackActions} from '../../mercury/utils/track';

/**
 * @typedef {Object} ThumbnailOptions
 * @property {string} mode
 * @property {number} width
 * @property {number} [height]
 */

export default Ember.Component.extend(
	VisibleMixin,
	{
		tagName: 'figure',
		classNames: ['media-component'],

		width: null,
		height: null,
		ref: null,
		emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
		visible: false,
		media: null,
		thumbnailer: Thumbnailer,
		limitHeight: false,
		normalizeWidth: true,

		// thumb widths
		thumbSize: {
			small: 340,
			medium: 660,
			large: 900,
		},

		// icon width depends on it's real dimensions
		iconHeight: 20,
		iconWidth: Ember.computed('media', 'iconHeight', function () {
			const media = this.get('media'),
				iconHeight = this.get('iconHeight');

			return Math.floor(iconHeight * media.width / media.height);
		}),

		/**
		 * caption for current media
		 */
		caption: Ember.computed('media', {
			get() {
				const media = this.get('media');

				if (media && typeof media.caption === 'string') {
					return media.caption;
				}
			},
			set(key, value) {
				return value;
			},
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			onVisible() {
				this.load();
			},

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
		 * @param {number} width
		 * @returns {number}
		 */
		normalizeThumbWidth(width) {
			if (width <= this.thumbSize.small) {
				return this.thumbSize.small;
			} else if (width <= this.thumbSize.medium) {
				return this.thumbSize.medium;
			}

			return this.thumbSize.medium;
		},

		/**
		 * @param {string} url
		 * @param {ThumbnailOptions} options
		 * @returns {string}
		 */
		getThumbURL(url, options) {
			if (options.width &&
				options.mode === Thumbnailer.mode.thumbnailDown &&
				this.get('normalizeWidth')
			) {
				options.width = this.normalizeThumbWidth(options.width);
			}

			// Sometimes width is null, so we need to make sure it has a value.
			options.width = options.width || this.thumbSize.small;

			if (!this.get('limitHeight')) {
				options.height = options.width;
			}

			url = this.thumbnailer.getThumbURL(url, options);

			return url;
		},
	}
);

