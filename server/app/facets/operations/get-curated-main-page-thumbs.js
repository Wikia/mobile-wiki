import Vignette from 'vignette';


function getImageThumb(imageUrl, width, height, mode, imageCrop) {
	const options = {
		width
	};

	if (imageCrop) {
		options.mode = Vignette.mode.windowCrop;
		options.xOffset1 = imageCrop.x;
		options.yOffset1 = imageCrop.y;
		options.xOffset2 = imageCrop.x + imageCrop.width;
		options.yOffset2 = imageCrop.y + imageCrop.height;
	} else {
		options.height = height;
		options.mode = mode;
	}

	return Vignette.getThumbURL(imageUrl, options);
}

/**
 * Get thumbs for curated main page
 *
 * @see front/main/app/mixins/curated-content-thumbnail.js
 * @param {object} data
 * @returns {object}
 */
export default function getCuratedMainPageThumbs(data) {
	const mainPageData = data.articlePage.data.mainPageData;

	if (mainPageData && mainPageData.featuredContent) {
		mainPageData.featuredContent.forEach((item) => {
			item.thumb_url = getImageThumb(
				item.image_url,
				400,
				400 / 16 * 9,
				Vignette.mode.zoomCrop,
				item.image_crop && item.image_crop.landscape
			);
		});
	}

	if (mainPageData && mainPageData.curatedContent) {
		mainPageData.curatedContent.forEach((item) => {
			if (item.image_url) {
				item.thumb_url = getImageThumb(
					item.image_url,
					200,
					200,
					Vignette.mode.topCrop,
					item.image_crop && item.image_crop.square
				);
			}
		});
	}

	return data;
}
