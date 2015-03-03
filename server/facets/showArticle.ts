/// <reference path="../../typings/hapi/hapi.d.ts" />

import Article = require('../lib/Article');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import Caching = require('../lib/Caching');
import localSettings = require('../../config/localSettings');

export = showArticle;

var cachingTimes = {
	enabled: false,
	cachingPolicy: Caching.Policy.Private,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.default
};

function showArticle (request: Hapi.Request, reply: Hapi.Response) {
	var path: string = request.path,
		wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request.headers.host);

	if (path === '/' || path === '/wiki/') {
		Article.getWikiVariables(wikiDomain, (error: any, wikiVariables: any) => {
			if (error) {
				// TODO check error.statusCode and react accordingly
				reply.redirect(localSettings.redirectUrlOnNoData);
			} else {
				Article.getArticle({
					wikiDomain: wikiDomain,
					title: wikiVariables.mainPageTitle,
					redirect: request.query.redirect
				}, wikiVariables, (error: any, result: any = {}) => {
					onArticleResponse(request, reply, error, result);
				});
			}
		});
	} else  {
		Article.getFull({
			wikiDomain: wikiDomain,
			title: request.params.title,
			redirect: request.query.redirect
		}, (error: any, result: any = {}) => {
			onArticleResponse(request, reply, error, result);
		});
	}
}

/**
 * Prepares article data to be rendered
 * TODO: clean up this function
 *
 * @param {Hapi.Request} request
 * @param result
 */
function beforeArticleRender (request: Hapi.Request, result: any): void {
	var title: string,
		articleDetails: any,
		userDir = 'ltr';

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
	result.queryParams = Utils.parseQueryParams(request.query);

	if (localSettings.optimizely.enabled && !result.queryParams.noexternals) {
		result.optimizelyScript = localSettings.optimizely.scriptPath +
			(localSettings.environment === Utils.Environment.Prod ?
			localSettings.optimizely.account : localSettings.optimizely.devAccount) + '.js';
	}
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 */
function onArticleResponse (request: Hapi.Request, reply: any, error: any, result: any = {}): void {
	var code = 200,
		response: Hapi.Response;

	if (!result.article.article && !result.wiki.dbName) {
		//if we have nothing to show, redirect to our fallback wiki
		reply.redirect(localSettings.redirectUrlOnNoData);
	} else {
		Tracking.handleResponse(result, request);

		if (error) {
			code = error.code || error.statusCode || 500;
			result.error = JSON.stringify(error);
		}

		beforeArticleRender(request, result);

		response = reply.view('application', result);
		response.code(code);
		Caching.setResponseCaching(response, cachingTimes);
	}
}
