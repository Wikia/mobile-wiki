import Thumbnailer from './thumbnailer';

export const MAX_WIDTH = 410;

export default class HeroImage {

	constructor(heroImage, width = MAX_WIDTH) {
		const imageAspectRatio = 16 / 9,
			imageWidth = heroImage.width || width,
			imageHeight = heroImage.height,
			maxWidth = Math.floor(imageHeight * imageAspectRatio);

		let computedHeight = imageHeight,
			cropMode = Thumbnailer.mode.thumbnailDown;

		// wide image - crop images wider than 16:9 aspect ratio to 16:9
		if (imageWidth > maxWidth) {
			cropMode = Thumbnailer.mode.zoomCrop;
			computedHeight = Math.floor(width / imageAspectRatio);
		}

		// image needs resizing
		if (width < imageWidth) {
			computedHeight = Math.floor(width * (imageHeight / imageWidth));
		}

		// tall image - use fixed-aspect-ratio-down for images taller than square
		if (width < computedHeight) {
			cropMode = Thumbnailer.mode.fixedAspectRatioDown;
			computedHeight = width;
		}

		this.computedHeight = computedHeight;
		// generate thumbnail
		this.thumbnailUrl = Thumbnailer.getThumbURL(heroImage.url, {
			mode: cropMode,
			height: computedHeight,
			width
		});
	}

}
