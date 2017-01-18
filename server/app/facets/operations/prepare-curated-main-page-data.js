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
function prepareCuratedMainPageModules(curatedMainPageData, fallbackData) {
	if (curatedMainPageData) {
		if (curatedMainPageData.featuredContent) {
			curatedMainPageData.featuredContent.forEach((item) => {
				item.imageUrl = getImageThumb(
					item.imageUrl,
					400,
					400 / 16 * 9,
					Vignette.mode.zoomCrop,
					item.imageCrop && item.imageCrop.landscape
				);
			});
		}

		if (curatedMainPageData.curatedContent && curatedMainPageData.curatedContent.items) {
			curatedMainPageData.curatedContent.items.forEach((item) => {
				if (item.imageUrl) {
					item.imageUrl = getImageThumb(
						item.imageUrl,
						200,
						200,
						Vignette.mode.topCrop,
						item.imageCrop && item.imageCrop.square
					);
				}
			});
		}

		// FIXME temporary solution for the time when the client is out of sync from the API
		// remove in XW-2628
		if (
			!curatedMainPageData.trendingArticles ||
			!curatedMainPageData.trendingVideos ||
			!curatedMainPageData.wikiaStats
		) {
			curatedMainPageData.trendingArticles = fallbackData.trendingArticles;
			curatedMainPageData.trendingVideos = fallbackData.trendingVideos;
			curatedMainPageData.wikiaStats = fallbackData.wikiaStats;
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
			}
		};

	if (pageData.details && pageData.details.description) {
		result.description = pageData.details.description;
	}

	result.articlePage.data.curatedMainPageData = prepareCuratedMainPageModules(
		pageData.curatedMainPageData,
		pageData.mainPageData
	);

	return result;
}
