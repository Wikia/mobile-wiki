import localSettings from '../../../config/localSettings';
import {gaUserIdHash} from '../../lib/hashing';
import {shouldAsyncArticle, parseQueryParams, getVerticalColor} from '../../lib/utils';
import {getTitle, isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData, getLocalSettings}
	from './page-data-helper';

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
		wikiVariables = data.wikiVariables,
		displayTitle = getTitle(request, pageData),
		userId = getUserId(request),

		result = {
			articlePage: data.page,
			asyncArticle: request.query._escaped_fragment_ !== '0' ?
				shouldAsyncArticle(localSettings, request.headers.host) :
				false,
			canonicalUrl: wikiVariables.basePath,
			documentTitle: displayTitle,
			displayTitle,
			gaUserIdHash: gaUserIdHash(userId),
			isRtl: isRtl(wikiVariables),
			// clone object to avoid overriding real localSettings for future requests
			localSettings: getLocalSettings(),
			optimizelyScript: getOptimizelyScriptUrl(request),
			qualarooScript: getQualarooScriptUrl(request),
			queryParams: parseQueryParams(request.query, allowedQueryParams),
			server: data.server,
			themeColor: getVerticalColor(localSettings, wikiVariables.vertical),
			userId,
			wikiVariables
		};

	if (pageData) {
		result.isMainPage = pageData.isMainPage;

		if (pageData.details) {
			result.canonicalUrl += pageData.details.url;
			result.documentTitle = pageData.details.documentTitle;
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
