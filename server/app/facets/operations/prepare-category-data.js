import {parseQueryParams} from '../../lib/utils';
import {getStandardTitle, getStandardResult, getOpenGraphData} from './page-data-helper';

/**
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareCategoryData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		pageData = data.page.data,
		displayTitle = getStandardTitle(request, pageData),
		i18n = request.server.methods.i18n.getInstance(),
		result = getStandardResult(request, data);

	result.displayTitle = displayTitle;
	result.documentTitle = displayTitle;
	result.asyncArticle = false;
	result.hasToC = false;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);
	result.subtitle = i18n.t('app.category-page-subtitle');

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.documentTitle = pageData.details.documentTitle;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('category', result.displayTitle, result.canonicalUrl);

	return result;
}
