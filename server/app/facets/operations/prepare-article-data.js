import * as Utils from '../../lib/utils';
import {gaUserIdHash} from '../../lib/hashing';
import localSettings from '../../../config/localSettings';
import {isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData,
	getLocalSettings} from './prepare-page-data';


/**
 * @param {Hapi.Request} request
 * @param {Object} articleData
 * @returns {String}
 */
export function getTitle(request, articleData) {
	if (articleData) {
		if (articleData.article && articleData.article.displayTitle) {
			return articleData.article.displayTitle;
		} else if (articleData.details && articleData.details.title) {
			return articleData.details.title;
		}
	}
	return request.params.title.replace(/_/g, ' ');
}

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
		wikiVariables = data.wikiVariables,
		result = {
			articlePage: data.page,
			server: data.server,
			wikiVariables: data.wikiVariables,
			displayTitle: getTitle(request, articleData),
		};

	let htmlTitle;

	if (articleData) {
		result.isMainPage = articleData.isMainPage;

		if (articleData.details) {
			result.canonicalUrl = wikiVariables.basePath + articleData.details.url;
			result.documentTitle = articleData.details.documentTitle;
		}

		if (articleData.article) {
			result.articleContent = articleData.article.content;
			delete articleData.article.content;

			result.hasToC = Boolean(result.articleContent.trim().length);
		}

		if (articleData.htmlTitle) {
			htmlTitle = articleData.htmlTitle;
		}
	}

	result.isRtl = isRtl(wikiVariables);

	result.htmlTitle = (htmlTitle) ? htmlTitle : Utils.getHtmlTitle(wikiVariables, result.displayTitle);
	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = getOpenGraphData('article', result.displayTitle, result.canonicalUrl, articleData);
	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = getLocalSettings();

	result.qualarooScript = getQualarooScriptUrl(request);
	result.optimizelyScript = getOptimizelyScriptUrl(request);
	result.userId = getUserId(request);
	result.gaUserIdHash = gaUserIdHash(result.userId);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.asyncArticle = (
		request.query._escaped_fragment_ !== '0' ?
			Utils.shouldAsyncArticle(localSettings, request.headers.host) :
			false
	);

	return result;
}
