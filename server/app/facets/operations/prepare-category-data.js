import {parseQueryParams} from '../../lib/utils';
import {getDocumentTitle, getDefaultTitle, getBaseResult, getOpenGraphData} from './page-data-helper';

/**
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareCategoryData(request, data) {
	const allowedQueryParams = ['noexternals', 'buckysampling'],
		pageData = data.page.data,
		result = getBaseResult(request, data);

	result.displayTitle = getDefaultTitle(request, pageData);
	result.documentTitle = getDocumentTitle(pageData) || result.displayTitle;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);
	result.subtitle = request.server.methods.i18n.getInstance().t('app.category-page-subtitle');

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.description = pageData.details.description;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('category', result.displayTitle, result.canonicalUrl);

	return result;
}
