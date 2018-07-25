import Thumbnailer from './thumbnailer';

export const MAX_WIDTH = 412;

const HERO_IMAGE_ASPECT_RATIO = 375 / MAX_WIDTH;

export default class HeroImage {

	constructor(heroImage, tallImageCropMode, width = MAX_WIDTH) {
		const imageAspectRatio = 5 / 4,
			imageWidth = heroImage.width || width,
			imageHeight = heroImage.height,
			maxWidth = Math.floor(imageHeight * imageAspectRatio);

		let computedHeight = imageHeight,
			cropMode = tallImageCropMode;

		// wide image - crop images wider than 5:4 aspect ratio to 5:4
		if (imageWidth > maxWidth) {
			cropMode = Thumbnailer.mode.zoomCrop;
			computedHeight = Math.floor(width / imageAspectRatio);
		} else {
			computedHeight = width * HERO_IMAGE_ASPECT_RATIO;
		}

		this.computedHeight = Math.round(computedHeight);
		// generate thumbnail
		this.thumbnailUrl = Thumbnailer.getThumbURL(heroImage.url, {
			mode: cropMode,
			height: this.computedHeight,
			width
		});
	}

}
