/// <reference path="../../../typings/hapi/hapi.d.ts" />

import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
var deepExtend = require('deep-extend');

var shouldAsyncArticle = Utils.shouldAsyncArticle;

/**
 * Prepares article data to be rendered
 * TODO: clean up this function
 *
 * @param {Hapi.Request} request
 * @param {ArticlePageData} data
 * @returns {object}
 */
function prepareArticleData(request: Hapi.Request, data: ArticlePageData): any {
	var title: string,
		htmlTitle: string,
		articleDetails: any,
		contentDir = 'ltr',
		allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		articleData: ArticleData = data.article.data,
		wikiVariables = data.wikiVariables,
		result: any = {
			article: data.article,
			server: data.server,
			wikiVariables: data.wikiVariables,
		};

	if (articleData) {
		result.isMainPage = articleData.isMainPage;

		if (articleData.details) {
			articleDetails = articleData.details;
			title = articleDetails.cleanTitle ? articleDetails.cleanTitle : articleDetails.title;
			result.canonicalUrl = wikiVariables.basePath + articleDetails.url;
		}

		if (articleData.article) {
			// we want to return the article content only once - as HTML and not JS variable
			result.articleContent = articleData.article.content;
			delete articleData.article.content;
		}

		if (articleData.htmlTitle) {
			htmlTitle = articleData.htmlTitle;
		}
	}

	if (!title) {
		// Fallback to title from URL
		title = request.params.title.replace(/_/g, ' ');
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.displayTitle = title;
	result.htmlTitle = (htmlTitle) ? htmlTitle : Utils.getHtmlTitle(wikiVariables, title);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = {
		type: 'article',
		title: title,
		url: result.canonicalUrl
	};

	if (articleDetails) {
		if (articleDetails.abstract) {
			result.openGraph.description = articleDetails.abstract;
		}

		if (articleDetails.thumbnail) {
			result.openGraph.image = articleDetails.thumbnail;
		}
	}

	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = deepExtend({}, localSettings);

	if (request.query.buckySampling !== undefined) {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	// all the third party scripts we don't want to load on noexternals
	if (!request.query.noexternals) {
		// qualaroo
		if (localSettings.qualaroo.enabled) {
			result.qualarooScript = localSettings.qualaroo.scriptUrl;
		}
	}

	result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	result.asyncArticle = (
		request.query._escaped_fragment_ !== '0' ?
			shouldAsyncArticle(localSettings, request.headers.host) :
			false
	);

	return result;
}

export = prepareArticleData;
