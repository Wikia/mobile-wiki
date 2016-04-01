import localSettings from '../../../config/localSettings';
import {shouldAsyncArticle, parseQueryParams} from '../../lib/utils';
import {getDocumentTitle, getDefaultTitle, getBaseResult, getOpenGraphData} from './page-data-helper';

/**
 * Prepares article data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareArticleData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		pageData = data.page.data,
		result = getBaseResult(request, data);

	result.displayTitle = getDefaultTitle(request, pageData);
	result.documentTitle = getDocumentTitle(pageData) || result.displayTitle;
	result.articlePage = data.page;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);
	result.asyncArticle = request.query._escaped_fragment_ !== '0' ?
		shouldAsyncArticle(localSettings, request.headers.host) :
		false;

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

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('article', result.displayTitle, result.canonicalUrl, pageData);

	return result;
}
