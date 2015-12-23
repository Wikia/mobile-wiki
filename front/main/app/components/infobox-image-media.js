import Ember from 'ember';
import ImageMediaComponent from './image-media';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

export default ImageMediaComponent.extend(
	ViewportMixin,
	{
		imageAspectRatio: 16 / 9,
		limitHeight: true,
		normalizeWidth: false,
		cropMode: Thumbnailer.mode.thumbnailDown,
		isInfoboxHeroImage: Ember.computed.equal('media.context', 'infobox-hero-image'),

		caption: Ember.computed('media.caption', 'isInfoboxHeroImage', function () {
			return this.get('isInfoboxHeroImage') ? false : this.get('media.caption');
		}),

		/**
		 * Extended version of ImageMediaComponent#computedHeight.
		 * Takes into account cropping main infobox images and basing on it's dimensions sets cropping mode.
		 */
		computedHeight: Ember.computed('viewportDimensions.width', 'media.width', 'media.height', 'isInfoboxHeroImage',
			function () {
				const windowWidth = this.get('viewportDimensions.width'),
					imageAspectRatio = this.get('imageAspectRatio'),
					imageWidth = this.get('media.width') || windowWidth,
					imageHeight = this.get('media.height'),
					maxWidth = Math.floor(imageHeight * imageAspectRatio);

				let computedHeight = imageHeight;

				// image needs resizing
				if (windowWidth < imageWidth) {
					computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
				}

				// wide image- image wider than 16:9 aspect ratio and inside the HeroImage module
				// Crop it to have 16:9 ratio.
				if (imageWidth > maxWidth && this.get('isInfoboxHeroImage')) {
					this.set('cropMode', Thumbnailer.mode.zoomCrop);
					return Math.floor(windowWidth / imageAspectRatio);
				}

				// high image- image higher than square. Use top-crop-down mode.
				if (windowWidth < computedHeight) {
					this.set('cropMode', Thumbnailer.mode.topCropDown);
					return windowWidth;
				}

				return computedHeight;
			}
		),

		/**
		 * return the params for getThumbURL for infobox image.
		 * In case of very high or very wide images, crop them properly.
		 */
		url: Ember.computed('media', 'computedHeight', 'imageSrc', 'viewportDimensions.width', {
			get() {
				const media = this.get('media'),
					computedHeight = this.get('computedHeight'),
					windowWidth = this.get('viewportDimensions.width');

				if (!media) {
					return this.get('imageSrc');
				}

				return this.getThumbURL(media.url, {
					mode: this.get('cropMode'),
					height: computedHeight,
					width: windowWidth
				});
			},
		}),
	}
);
