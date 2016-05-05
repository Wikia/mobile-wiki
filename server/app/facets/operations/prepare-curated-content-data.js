import {getBaseResult, getCuratedMainPageTitle, getOpenGraphData} from './page-data-helper';

/**
 * Handles category or section response for Curated Main Page from API
 *
 * @param {Hapi.Request} request
 * @param {CuratedContentPageData} data
 * @returns {Object}
 */
export default function prepareCuratedContentData(request, data) {
	const wikiVariables = data.wikiVariables,
		separator = wikiVariables.htmlTitle.separator,
		result = getBaseResult(request, data);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	if (data.mainPageData && data.mainPageData.details) {
		result.description = data.mainPageData.details.description;
	}

	result.displayTitle = getCuratedMainPageTitle(request, wikiVariables);
	result.documentTitle = result.displayTitle + separator + result.documentTitle;
	result.isMainPage = true;
	result.mainPageData = data.mainPageData;
	result.openGraph = getOpenGraphData('website', result.displayTitle, result.canonicalUrl, result.mainPageData);

	return result;
}
