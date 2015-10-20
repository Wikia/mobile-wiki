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
		contentDir = 'ltr',
		allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		articleData = result.article.data,
		wikiVariables = result.wikiVariables;

	if (articleData.details) {
		articleDetails = articleData.details;
		title = articleDetails.cleanTitle ? articleDetails.cleanTitle : articleDetails.title;
	} else if (request.params.title) {
		title = request.params.title.replace(/_/g, ' ');
	} else {
		title = wikiVariables.mainPageTitle.replace(/_/g, ' ');
	}

	if (articleData.article) {
		// we want to return the article content only once - as HTML and not JS variable
		result.articleContent = articleData.article.content;
		delete articleData.article.content;
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.mainPageData = {};
	result.mainPageData.adsContext = articleData.adsContext;
	result.mainPageData.ns = articleData.details.ns;

	result.displayTitle = title;
	result.isMainPage = (title === wikiVariables.mainPageTitle.replace(/_/g, ' '));
	result.canonicalUrl = wikiVariables.basePath + wikiVariables.articlePath + title.replace(/ /g, '_');
	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = {
		type: result.isMainPage ? 'website' : 'article',
		title: result.isMainPage ? wikiVariables.siteName : title,
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

	result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	result.asyncArticle = (
		request.query._escaped_fragment_ !== '0' ?
		shouldAsyncArticle(localSettings, request.headers.host) :
		false
	);

	delete result.adsContext;
}

export = prepareMainPageData;
