import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
	RenderComponentMixin,
	ViewportMixin,
	{
		computedWidth: 410,

		cropMode: computed(function () {
			const windowWidth = this.get('computedWidth'),
				imageWidth = this.get('width') || windowWidth,
				imageHeight = this.get('height');

			let computedHeight = imageHeight;

			// image needs resizing
			if (windowWidth < imageWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (windowWidth < computedHeight) {
				return Thumbnailer.mode.topCropDown;
			}

			return Thumbnailer.mode.thumbnailDown;
		}),

		computedHeight: computed(function () {
			const windowWidth = this.get('computedWidth'),
				imageWidth = this.get('width') || windowWidth,
				imageHeight = this.get('height');

			let computedHeight = imageHeight;

			// image needs resizing
			if (windowWidth < imageWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (windowWidth < computedHeight) {
				return windowWidth;
			}

			return computedHeight;
		}),
	}
);
