import {readOnly, gt} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin,
	ViewportMixin,
	{
		classNames: ['pi-image-collection'],

		imageAspectRatio: 16 / 9,
		currentImageIndex: 0,

		currentImage: computed('items', 'currentImageIndex', function () {
			return this.get('items')[this.get('currentImageIndex')];
		}),

		collectionLength: readOnly('items.length'),

		hasNextImage: computed('currentImageIndex', 'collectionLength', function () {
			return this.get('currentImageIndex') < (this.get('collectionLength') - 1);
		}),

		hasPreviousImage: gt('currentImageIndex', 0),

		cropMode: computed('currentImage', function () {
			const currentImage = this.get('currentImage');

			return currentImage.height > currentImage.width ?
				Thumbnailer.mode.topCropDown :
				Thumbnailer.mode.zoomCrop;
		}),

		computedWidth: readOnly('viewportDimensions.width'),

		computedHeight: computed('currentImage', function () {
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
			openLightbox(galleryRef) {
				// openLightbox is set in getAttributesForMedia() inside utils/article-media.js
				this.get('openLightbox')(this.get('currentImage.ref'), galleryRef);
			},
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
	});
