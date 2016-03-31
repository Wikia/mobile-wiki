import localSettings from '../../../config/localSettings';
import {gaUserIdHash} from '../../lib/hashing';
import {getTitle, shouldAsyncArticle, parseQueryParams, getVerticalColor} from '../../lib/utils';
import {isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData, getLocalSettings}
	from './prepare-page-data';

/**
 * Prepares article data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareArticleData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		articleData = data.page.data,
		displayTitle = getTitle(request, articleData),
		userId = getUserId(request),
		wikiVariables = data.wikiVariables,

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
			wikiVariables: data.wikiVariables
		};

	if (articleData) {
		result.isMainPage = articleData.isMainPage;

		if (articleData.details) {
			result.canonicalUrl += articleData.details.url;
			result.documentTitle = articleData.details.documentTitle;
		}

		if (articleData.article) {
			result.articleContent = articleData.article.content;
			delete articleData.article.content;

			result.hasToC = Boolean(result.articleContent.trim().length);
		}
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('article', result.displayTitle, result.canonicalUrl, articleData);

	return result;
}
