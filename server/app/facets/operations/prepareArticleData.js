import * as Utils from '../../lib/Utils';
import {gaUserIdHash} from '../../lib/Hashing';
import localSettings from '../../../config/localSettings';
// eslint-disable-next-line max-len
import {isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData, getLocalSettings} from './preparePageData';


/**
 * @param {Hapi.Request} request
 * @param {Object} articleData
 * @returns {String} title
 */
export function getTitle(request, articleData) {
	let title;

	if (articleData.article && articleData.article.displayTitle) {
		title = articleData.article.displayTitle;
	} else if (articleData.details && articleData.details.title) {
		title = articleData.details.title;
	} else {
		title = request.params.title.replace(/_/g, ' ');
	}

	return title;
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
			displayTitle: request.params.title.replace(/_/g, ' '),
		};

	let htmlTitle;

	if (articleData) {
		result.isMainPage = articleData.isMainPage;
		result.displayTitle = getTitle(request, articleData);

		if (articleData.details) {
			result.canonicalUrl = wikiVariables.basePath + articleData.details.url;
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

	result.prerenderEnabled = localSettings.prerenderHost.some(
		(host) => request.headers.host === host
	);

	return result;
}
