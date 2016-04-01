import {getOpenGraphData} from './page-data-helper';

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
	const pageData = data.page.data,
		wikiVariables = data.wikiVariables,

		result = {
			hasToC: false,
			openGraph: getOpenGraphData('website', wikiVariables.siteName, getOpenGraphUrl(wikiVariables)),
			mainPageData: {
				adsContext: pageData.adsContext
			}
		};

	if (pageData.details && pageData.details.ns) {
		result.mainPageData.ns = pageData.details.ns;
	}

	return result;
}
