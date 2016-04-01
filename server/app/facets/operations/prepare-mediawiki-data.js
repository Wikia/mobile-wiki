import {parseQueryParams} from '../../lib/utils';
import {getStandardResult, getOpenGraphData} from './page-data-helper';

/**
 * Sets minimum data that is required to start the Ember app
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMediaWikiData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		pageData = data.page.data,
		result = getStandardResult(request, data);

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.documentTitle = pageData.details.documentTitle;
	}

	if (data.page.exception) {
		result.exception = data.page.exception;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.asyncArticle = false;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = getOpenGraphData('wiki-page', result.displayTitle, result.canonicalUrl);

	return result;
}
