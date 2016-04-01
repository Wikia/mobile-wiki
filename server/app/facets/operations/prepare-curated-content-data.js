import {getStandardResult, getCuratedMainPageTitle, getOpenGraphData} from './page-data-helper';

/**
 * Handles category or section response for Curated Main Page from API
 *
 * @param {Hapi.Request} request
 * @param {CuratedContentPageData} data
 * @returns {Object}
 */
export default function prepareCuratedContentData(request, data) {
	const wikiVariables = data.wikiVariables,
		displayTitle = getCuratedMainPageTitle(request, wikiVariables),
		result = getStandardResult(request, data);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.displayTitle = displayTitle;
	result.documentTitle = displayTitle;
	result.isMainPage = true;
	result.mainPageData = data.mainPageData;
	result.openGraph = getOpenGraphData('website', result.displayTitle, result.canonicalUrl, result.mainPageData);

	return result;
}
