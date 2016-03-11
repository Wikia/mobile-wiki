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
		result = {};

	result.mainPageData = {};
	result.mainPageData.adsContext = articleData.adsContext;
	result.mainPageData.ns = articleData.details.ns;

	result.openGraph = getOpenGraphData('website', wikiVariables.siteName, getOpenGraphUrl(wikiVariables));

	return result;
}
