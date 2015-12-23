import Ember from 'ember';
import MediaComponent from './media';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

export default MediaComponent.extend(
	ViewportMixin,
	{
		classNames: ['pi-image-collection'],
		classNameBindings: ['visible'],
		layoutName: 'components/infobox-image-collection',
		limitHeight: true,
		imageAspectRatio: 16 / 9,
		activeRef: 0,

		collectionLength: Ember.computed('media', function () {
			return this.get('media').length;
		}),

		hasNextImage: Ember.computed('activeRef', 'collectionLength', function () {
			return this.get('activeRef') < (this.get('collectionLength') - 1);
		}),

		hasPreviousImage: Ember.computed.gt('activeRef', 0),

		/**
		 * @param {ArticleMedia} media
		 * @returns {number}
		 */
		computedHeight(media) {
			const windowWidth = this.get('viewportDimensions.width'),
				imageAspectRatio = this.get('imageAspectRatio'),
				imageWidth = media.width || windowWidth,
				imageHeight = media.height,
				maxWidth = Math.floor(imageHeight * imageAspectRatio);

			let computedHeight = imageHeight;

			if (imageWidth > windowWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// wide image- image wider than 16:9 aspect ratio
			// Crop it to have 16:9 ratio.
			if (imageWidth > maxWidth) {
				return Math.floor(windowWidth / imageAspectRatio);
			}

			// high image- image higher than square.
			if (windowWidth < computedHeight) {
				return windowWidth;
			}

			return computedHeight;
		},

		/**
		 * @returns {void}
		 */
		setup() {
			const mediaArray = Ember.A(),
				emptyGif = this.get('emptyGif');

			/**
			 * @param {ArticleMedia} image
			 * @param {number} index
			 * @returns {void}
			 */
			this.get('media').forEach((image, index) => {
				image.galleryRef = index;
				image.thumbUrl = emptyGif;
				image.isActive = (index === this.get('activeRef'));

				mediaArray.pushObject(Ember.Object.create(image));
			});

			this.set('media', mediaArray);
		},

		/**
		 * @returns {void}
		 */
		loadImages() {
			const width = this.get('viewportDimensions.width');

			/**
			 * @param {ArticleMedia} image
			 * @param {number} index
			 * @returns {void}
			 */
			this.get('media').forEach((image) => {
				const cropMode = image.height > image.width ?
						Thumbnailer.mode.topCropDown :
						Thumbnailer.mode.zoomCrop,
					height = this.computedHeight(image),
					thumbUrl = this.getThumbURL(image.url, {
						mode: cropMode,
						width,
						height
					});

				image.setProperties({
					thumbUrl,
					load: true
				});
			});

		},

		/**
		 * @returns {void}
		 */
		load() {
			this.setup();
			this.loadImages();
			this.set('visible', true);
		},

		actions: {
			/**
			 * @param {string} direction
			 * @returns {void}
			 */
			switchImage(direction) {
				const oldRef = this.get('activeRef'),
					refDirection = (direction === 'next') ? 1 : -1,
					newRef = oldRef + refDirection,
					media = this.get('media'),
					oldImage = media.get(oldRef),
					newImage = media.get(newRef);

				oldImage.set('isActive', false);
				newImage.set('isActive', true);
				this.set('activeRef', newRef);
			},
		},
	}
);
