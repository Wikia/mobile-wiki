import {parseQueryParams} from '../../lib/utils';
import {getDocumentTitle, getDefaultTitle, getBaseResult, getOpenGraphData} from './page-data-helper';

/**
 * Sets minimum data that is required to start the Ember app
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMediaWikiData(request, data) {
	const allowedQueryParams = ['noexternals', 'buckysampling'],
		pageData = data.page.data,
		result = getBaseResult(request, data);

	result.displayTitle = getDefaultTitle(request, pageData);
	result.documentTitle = getDocumentTitle(pageData) || result.displayTitle;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.description = pageData.details.description;
	}

	if (data.page.exception) {
		result.exception = data.page.exception;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('wiki-page', result.displayTitle, result.canonicalUrl);

	return result;
}
