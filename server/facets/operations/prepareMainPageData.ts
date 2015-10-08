/// <reference path="../../../typings/hapi/hapi.d.ts" />

import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
var deepExtend = require('deep-extend');

var shouldAsyncArticle = Utils.shouldAsyncArticle;

/**
 * Prepares main page data to be rendered
 * @TODO CONCF-761 - part after prepareData is common for Main Page and article
 * - should be moved to some common piece of code.
 * @param {Hapi.Request} request
 * @param result
 */
function prepareMainPageData (request: Hapi.Request, result: any): void {
	var title: string,
		articleDetails: any,
		contentDir = 'ltr';

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
		contentDir = result.wiki.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.mainPageData = {};
	result.mainPageData.adsContext = result.article.adsContext;
	result.mainPageData.ns = result.article.details.ns;

	result.displayTitle = title;
	result.isMainPage = (title === result.wiki.mainPageTitle.replace(/_/g, ' '));
	result.canonicalUrl = result.wiki.basePath + result.wiki.articlePath + title.replace(/ /g, '_');
	result.themeColor = Utils.getVerticalColor(localSettings, result.wiki.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, ['noexternals', 'buckysampling']);
	result.openGraph = {
		type: result.isMainPage ? 'website' : 'article',
		title: result.isMainPage ? result.wiki.siteName : title,
		url: result.canonicalUrl
	};
	if (result.article.details) {
		if (result.article.details.abstract) {
			result.openGraph.description = result.article.details.abstract;
		}
		if (result.article.details.thumbnail) {
			result.openGraph.image = result.article.details.thumbnail;
		}
	}

	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = deepExtend({}, localSettings);

	if (request.query.buckySampling !== undefined) {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	result.asyncArticle = (
		request.query._escaped_fragment_ !== '0' ?
		shouldAsyncArticle(localSettings, request.headers.host) :
		false
	);

	delete result.adsContext;
}

export = prepareMainPageData;
