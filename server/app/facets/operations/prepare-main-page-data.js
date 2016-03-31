import {getOpenGraphData} from './prepare-page-data';

/**
 * @param {Object} wikiVariables
 * @returns {String} url for openGraph
 */
function getOpenGraphUrl(wikiVariables) {
	return wikiVariables.basePath + wikiVariables.articlePath + wikiVariables.siteName.replace(/ /g, '_');
}

/**
 * Prepares main page data to be rendered
 *
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMainPageData(data) {
	const articleData = data.page.data,
		wikiVariables = data.wikiVariables,
		result = {
			hasToC: false,
			mainPageData: {
				adsContext: articleData.adsContext
			},
			openGraph: getOpenGraphData('website', wikiVariables.siteName, getOpenGraphUrl(wikiVariables))
		};

	if (articleData.details && articleData.details.ns) {
		result.mainPageData.ns = articleData.details.ns;
	}

	return result;
}
