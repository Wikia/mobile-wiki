import {parseQueryParams} from '../../lib/utils';
import {getDisplayTitle, getBaseResult, getOpenGraphData} from './page-data-helper';

/**
 * Sets minimum data that is required to start the Ember app
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMediaWikiDataOnError(request, data) {
	const allowedQueryParams = ['noexternals', 'buckysampling'],
		pageData = data.page.data,
		separator = data.wikiVariables.htmlTitle.separator,
		result = getBaseResult(request, data);

	result.displayTitle = getDisplayTitle(request, pageData);
	result.htmlTitle = result.displayTitle + separator + result.wikiHtmlTitle;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);
	result.showSpinner = true;

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.description = pageData.details.description;
	}

	if (data.page.exception) {
		result.exception = data.page.exception;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.settings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('wiki-page', result.displayTitle, result.canonicalUrl);

	return result;
}
