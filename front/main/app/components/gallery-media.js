import Ember from 'ember';
import MediaComponent from './media';
import ArticleContentMixin from '../mixins/article-content';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

/**
 * ArticleMedia
 * @typedef {Ember.Object} ArticleMedia
 * @property {number} galleryRef
 * @property {string} thumbUrl
 * @property {string} captionClass
 */

export default MediaComponent.extend(
	ArticleContentMixin,
	{
		classNames: ['article-gallery'],
		layoutName: 'components/gallery-media',

		thumbSize: 195,
		// limit how many images get rendered before user scrolls to a gallery
		limit: 2,
		incrementLimitValue: 10,

		limitedMedia: Ember.computed('media', 'limit', function () {
			const limit = this.get('limit');

			if (limit > 0) {
				return this.get('media').slice(0, limit);
			}

			return this.get('media');
		}),

		/**
		 * @returns {void}
		 */
		setUp() {
			const mediaArray = Ember.A(),
				emptyGif = this.get('emptyGif');

			/**
			 * @property {ArticleMedia} media
			 * @property {number} index
			 * @return {void}
			 */
			this.get('media').forEach((media, index) => {
				media.galleryRef = index;
				media.thumbUrl = emptyGif;
				media.captionClass = Ember.get(media, 'caption.length') > 0 ? ' has-caption' : '';

				mediaArray.pushObject(Ember.Object.create(media));
			});

			this.setProperties({
				media: mediaArray,
				limit: this.incrementLimitValue,
				galleryLength: mediaArray.length
			});
		},

		/**
		 * @param {*} imageOrGalleryRef
		 * @param {number} [limit=2]
		 * @param {number} [thumbSize=this.get('thumbSize')]
		 * @returns {void}
		 */
		loadImages(imageOrGalleryRef, limit = 2, thumbSize = this.get('thumbSize')) {
			let galleryRef = typeof imageOrGalleryRef === 'number' ?
					imageOrGalleryRef :
					parseInt(imageOrGalleryRef.getAttribute('data-gallery-ref'), 10),
				mode = Thumbnailer.mode.topCrop,
				height = thumbSize,
				width = thumbSize,
				image;

			limit = Math.min(galleryRef + limit, this.get('galleryLength') - 1);

			for (; galleryRef <= limit; galleryRef++) {
				image = this.get('media').get(galleryRef);

				if (image.context === 'icon') {
					mode = Thumbnailer.mode.scaleToWidth;
					height = this.get('iconHeight');
					width = this.get('iconWidth');
				}

				image.setProperties({
					thumbUrl: this.getThumbURL(image.url, {
						mode,
						height,
						width
					}),
					load: true
				});
			}
		},

		/**
		 * Loads media and certain amount of images depending on the gallery width and
		 * thumbSize sets also onscroll handler
		 *
		 * @returns {void}
		 */
		load() {
			const $this = this.$(),
				galleryWidth = $this.width(),
				thumbSize = this.get('thumbSize'),
				maxImages = Math.ceil(galleryWidth / thumbSize);

			this.setUp();
			this.loadImages(0, maxImages);

			$this.on('scroll', () => {
				Ember.run.debounce(this, 'onScroll', maxImages, 100);
			});
		},

		/**
		 * Check if the offsetLeft of image is smaller than
		 * sum of gallery width and its scrollLeft. If so, lazy load
		 * the next maxImages amount of images.
		 * If the gallery element is nested inside other element,
		 * the position: relative has to be set on .article-gallery in order to assign
		 * proper offsetParent to the image element.
		 *
		 * @param {number} maxImages
		 * @returns {void}
		 */
		onScroll(maxImages) {
			const $this = this.$(),
				imagesToLoad = $this.find('img:not(.loaded)'),
				galleryOffset = $this.scrollLeft() + $this.width();

			if (imagesToLoad.length) {
				/**
				 * @property {number} index
				 * @property {HTMLImageElement} image
				 * @returns {void}
				 */
				imagesToLoad.each((index, image) => {
					if (image.offsetLeft < galleryOffset) {
						this.loadImages(image, maxImages);
					}
				});
			} else if (this.get('limit') < this.get('galleryLength')) {
				this.incrementProperty('limit', this.incrementLimitValue);
			} else {
				$this.off('scroll');
			}
		},
	}
);
