import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	ViewportMixin,
	{
		classNames: ['pi-image-collection'],

		imageAspectRatio: 16 / 9,
		currentImageIndex: 0,

		currentImage: Ember.computed('items', 'currentImageIndex', function () {
			return this.get('items')[this.get('currentImageIndex')];
		}),

		collectionLength: Ember.computed.readOnly('items.length'),

		hasNextImage: Ember.computed('currentImageIndex', 'collectionLength', function () {
			return this.get('currentImageIndex') < (this.get('collectionLength') - 1);
		}),

		hasPreviousImage: Ember.computed.gt('currentImageIndex', 0),

		cropMode: Ember.computed('currentImage', function () {
			const currentImage = this.get('currentImage');

			return currentImage.height > currentImage.width ?
				Thumbnailer.mode.topCropDown :
				Thumbnailer.mode.zoomCrop;
		}),

		width: Ember.computed.readOnly('viewportDimensions.width'),

		height: Ember.computed('width', 'currentImage', function () {
			const width = this.get('width'),
				imageAspectRatio = this.get('imageAspectRatio'),
				currentImage = this.get('currentImage'),
				imageWidth = currentImage.width || width,
				imageHeight = currentImage.height,
				maxWidth = Math.floor(imageHeight * imageAspectRatio);

			let computedHeight = imageHeight;

			if (imageWidth > width) {
				computedHeight = Math.floor(width * (imageHeight / imageWidth));
			}

			// wide image - image wider than 16:9 aspect ratio
			// Crop it to have 16:9 ratio.
			if (imageWidth > maxWidth) {
				return Math.floor(width / imageAspectRatio);
			}

			// high image - image higher than square
			if (width < computedHeight) {
				return width;
			}

			return computedHeight;
		}),

		actions: {
			/**
			 * @param {Number} direction - 1 for next or -1 for previous
			 * @returns {void}
			 */
			switchImage(direction) {
				const currentImageIndex = this.get('currentImageIndex'),
					newImageIndex = currentImageIndex + direction;

				this.set('currentImageIndex', newImageIndex);
			}
		}
	}
);
