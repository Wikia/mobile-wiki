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
 * @param {object} mainPageData
 * @returns {object}
 */
function prepareCuratedMainPageModules(mainPageData) {
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
			item.url = item.url || item.article_local_url;
			item.label = item.label || item.title;

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

	return mainPageData;
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
			mainPageData: {
				adsContext: pageData.adsContext
			},
			showSpinner: true,
			articlePage: {
				data: {}
			}
		};

	if (pageData.details) {
		if (pageData.details.description) {
			result.description = pageData.details.description;
		}

		if (pageData.details.ns) {
			result.mainPageData.ns = pageData.details.ns;
		}
	}

	result.articlePage.data.mainPageData = prepareCuratedMainPageModules(pageData.mainPageData);

	return result;
}
