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
		result = getBaseResult(request, data),
		mainPageData = data.mainPageData;

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	if (mainPageData && mainPageData.details) {
		result.description = mainPageData.details.description;
		result.articleId = mainPageData.details ? mainPageData.details.id : 0;
	}
	result.displayTitle = getCuratedMainPageTitle(request, wikiVariables);
	result.documentTitle = result.displayTitle + separator + result.documentTitle;
	result.isMainPage = true;
	result.showSpinner = true;
	result.mainPageData = mainPageData;
	result.openGraph = getOpenGraphData('website', result.displayTitle, result.canonicalUrl, result.mainPageData);

	result.globalFooter = data.globalFooter;
	result.globalNavigation = data.globalNavigation;
	result.bodyClassName = data.bodyClassName;

	return result;
}
