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

		computedWidth: Ember.computed.readOnly('viewportDimensions.width'),

		computedHeight: Ember.computed('currentImage', function () {
			const windowWidth = this.get('viewportDimensions.width'),
				imageAspectRatio = this.get('imageAspectRatio'),
				currentImage = this.get('currentImage'),
				imageWidth = currentImage.width || windowWidth,
				imageHeight = currentImage.height,
				maxWidth = Math.floor(imageHeight * imageAspectRatio);

			let computedHeight = imageHeight;

			// wide image - image wider than 16:9 aspect ratio
			// Crop it to have 16:9 ratio.
			if (imageWidth > maxWidth) {
				return Math.floor(windowWidth / imageAspectRatio);
			}

			if (imageWidth > windowWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// high image - image higher than square
			if (windowWidth < computedHeight) {
				return windowWidth;
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
