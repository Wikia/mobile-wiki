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

/**
 * Get thumbs and labels for curated main page modules
 *
 * @see front/main/app/mixins/curated-content-thumbnail.js
 * @param {object} curatedMainPageData
 * @returns {object}
 */
function prepareCuratedMainPageModules(curatedMainPageData) {
	if (curatedMainPageData && curatedMainPageData.featuredContent) {
		curatedMainPageData.featuredContent.forEach((item) => {
			item.thumb_url = getImageThumb(
				item.image_url,
				400,
				400 / 16 * 9,
				Vignette.mode.zoomCrop,
				item.image_crop && item.image_crop.landscape
			);
		});
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
			curatedMainPageData: {
				adsContext: pageData.adsContext
			},
			articlePage: {
				data: {}
			}
		};

	if (pageData.details) {
		if (pageData.details.description) {
			result.description = pageData.details.description;
		}

		if (pageData.details.ns) {
			result.curatedMainPageData.ns = pageData.details.ns;
		}
	}

	result.articlePage.data.curatedMainPageData = prepareCuratedMainPageModules(pageData.curatedMainPageData);

	return result;
}
