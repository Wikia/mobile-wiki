import Vignette from 'vignette';
import {getOpenGraphData, getOpenGraphUrl} from './page-data-helper';

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

function setThumbsForCuratedContent(item) {
	const newItem = item;

	if (item.imageUrl) {
		newItem.imageUrl = getImageThumb(
			item.imageUrl,
			200,
			200,
			Vignette.mode.topCrop,
			item.imageCrop && item.imageCrop.square
		);
	}

	if (item.items) {
		newItem.items = item.items.map(setThumbsForCuratedContent);
	}

	return newItem;
}

/**
 * Get thumbs and labels for curated main page modules
 *
 * @see front/main/app/mixins/curated-content-thumbnail.js
 * @param {object} curatedMainPageData
 * @returns {object}
 */
function prepareCuratedMainPageModules(curatedMainPageData) {
	if (curatedMainPageData) {
		const featuredContent = curatedMainPageData.featuredContent,
			curatedContent = curatedMainPageData.curatedContent;

		if (featuredContent) {
			curatedMainPageData.featuredContent = featuredContent.map((item) => {
				const newItem = item;

				newItem.imageUrl = getImageThumb(
					item.imageUrl,
					400,
					400 / 16 * 9,
					Vignette.mode.zoomCrop,
					item.imageCrop && item.imageCrop.landscape
				);

				return newItem;
			});
		}

		if (curatedContent && curatedContent.items) {
			curatedContent.items = curatedContent.items.map(setThumbsForCuratedContent);
		}
	}

	return curatedMainPageData;
}
/**
 * Prepare data for curated main pages
 *
 * @param {object} data
 * @returns {object}
 */
export default function prepareCuratedMainPageData(data) {
	const pageData = data.page.data,
		wikiVariables = data.wikiVariables,
		result = {
			openGraph: getOpenGraphData('website', wikiVariables.siteName, getOpenGraphUrl(wikiVariables)),
			articlePage: {
				data: {}
			},
			showSpinner: true
		};

	if (pageData.details && pageData.details.description) {
		result.description = pageData.details.description;
	}

	result.articlePage.data.curatedMainPageData = prepareCuratedMainPageModules(pageData.curatedMainPageData);

	return result;
}
