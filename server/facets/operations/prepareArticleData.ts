/// <reference path="../../../typings/hapi/hapi.d.ts" />

import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');

/**
 * Prepares article data to be rendered
 * TODO: clean up this function
 *
 * @param {Hapi.Request} request
 * @param result
 */
function prepareArticleData (request: Hapi.Request, result: any): void {
	var title: string,
		articleDetails: any,
		userDir = 'ltr',
		allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'];

	if (result.article.details) {
		articleDetails = result.article.details;
		title = articleDetails.cleanTitle ? articleDetails.cleanTitle : articleDetails.title;
	} else if (request.params.title) {
		title = request.params.title.replace(/_/g, ' ');
	} else {
		title = result.wiki.mainPageTitle.replace(/_/g, ' ');
	}

	if (result.article.article) {
		// we want to return the article content only once - as HTML and not JS variable
		result.articleContent = result.article.article.content;
		delete result.article.article.content;
	}

	if (result.wiki.language) {
		userDir = result.wiki.language.userDir;
		result.isRtl = (userDir === 'rtl');
	}

	result.displayTitle = title;
	result.isMainPage = (title === result.wiki.mainPageTitle.replace(/_/g, ' '));
	result.canonicalUrl = result.wiki.basePath + result.wiki.articlePath + title.replace(/ /g, '_');
	result.themeColor = Utils.getVerticalColor(localSettings, result.wiki.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);

	result.weppyConfig = localSettings.weppy;
	if (typeof result.queryParams.buckySampling === 'number') {
		result.weppyConfig.samplingRate = result.queryParams.buckySampling / 100;
	}

	result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;
	result.asyncArticle = shouldAsyncArticle(result);
}

/**
 * (HG-753) This allows for loading article content asynchronously while providing a version of the page with
 * article content that search engines can still crawl.
 * @see https://developers.google.com/webmasters/ajax-crawling/docs/specification
 */
function shouldAsyncArticle(result: any): boolean {
	var asyncEnabled = localSettings.asyncArticle.indexOf(result.wiki.dbName) > -1,
		noEscapedFragment = result.queryParams._escaped_fragment_ !== 0;

	return asyncEnabled && noEscapedFragment;
}

export = prepareArticleData;
