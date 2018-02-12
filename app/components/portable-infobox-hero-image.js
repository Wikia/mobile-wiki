import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';
import RenderComponentMixin from '../mixins/render-component';
import {MAX_WIDTH} from '../modules/hero-image';

export default Component.extend(
	RenderComponentMixin,
	ViewportMixin,
	{
		cropMode: computed(function () {
			const imageWidth = this.get('width') || MAX_WIDTH,
				imageHeight = this.get('height');

			let computedHeight = imageHeight;

			// image needs resizing
			if (MAX_WIDTH < imageWidth) {
				computedHeight = Math.floor(MAX_WIDTH * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (MAX_WIDTH < computedHeight) {
				return Thumbnailer.mode.topCropDown;
			}

			return Thumbnailer.mode.thumbnailDown;
		}),

		computedHeight: computed(function () {
			const imageWidth = this.get('width') || MAX_WIDTH,
				imageHeight = this.get('height');

			let computedHeight = imageHeight;

			// image needs resizing
			if (MAX_WIDTH < imageWidth) {
				computedHeight = Math.floor(MAX_WIDTH * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (MAX_WIDTH < computedHeight) {
				return windowWidth;
			}

			return computedHeight;
		}),
	}
);
