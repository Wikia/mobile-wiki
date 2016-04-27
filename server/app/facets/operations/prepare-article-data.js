import {parseQueryParams} from '../../lib/utils';
import {getDefaultTitle, getBaseResult, getOpenGraphData} from './page-data-helper';

/**
 * Prepares article data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareArticleData(request, data) {
	const allowedQueryParams = ['noexternals', 'buckysampling'],
		pageData = data.page.data,
		separator = data.wikiVariables.htmlTitle.separator,
		result = getBaseResult(request, data);

	result.displayTitle = getDefaultTitle(request, pageData);
	result.articlePage = data.page;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);

	if (pageData) {
		result.isMainPage = pageData.isMainPage;

		if (pageData.details) {
			result.canonicalUrl += pageData.details.url;
			result.description = pageData.details.description;
		}

		if (pageData.article) {
			result.articleContent = pageData.article.content;
			delete pageData.article.content;

			result.hasToC = Boolean(result.articleContent.trim().length);
		}
	}

	/**
	 * This is necessary to avoid having duplicated title on CMP
	 * This should be removed in XW-1442
	 */
	if (!result.isMainPage) {
		result.documentTitle = result.displayTitle + separator + result.documentTitle;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('article', result.displayTitle, result.canonicalUrl, pageData);

	return result;
}
