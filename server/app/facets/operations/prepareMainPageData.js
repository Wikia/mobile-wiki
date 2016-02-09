import {getOpenGraphData} from './preparePageData';

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
 * @param {ArticlePageData} data
 * @returns {object}
 */
export default function prepareMainPageData(data) {
	const articleData = data.article.data,
		wikiVariables = data.wikiVariables,
		result = {};

	result.mainPageData = {};
	result.mainPageData.adsContext = articleData.adsContext;
	result.mainPageData.ns = articleData.details.ns;

	result.openGraph = getOpenGraphData('website', wikiVariables.siteName, getOpenGraphUrl(wikiVariables));

	return result;
}
