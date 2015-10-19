/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../lib/Article.ts" />

import Promise = require('bluebird');
import Article = require('../lib/Article');
import Caching = require('../lib/Caching');
import Logger = require('../lib/Logger');
import Tracking = require('../lib/Tracking');
import Utils = require('../lib/Utils');
import localSettings = require('../../config/localSettings');
import prepareArticleData = require('./operations/prepareArticleData');
import prepareMainPageData = require('./operations/prepareMainPageData');

var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

function showArticle (request: Hapi.Request, reply: Hapi.Response): void {
	var path: string = request.path,
		wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request),
		params: ArticleRequestParams = {
			wikiDomain: wikiDomain,
			redirect: request.query.redirect
		},
		article: Article.ArticleRequestHelper,
		allowCache = true;

	//TODO: This is really only a temporary check while we see if loading a smaller
	//article has any noticable effect on engagement
	if (Utils.shouldAsyncArticle(localSettings, request.headers.host)) {
		// Only request an adequate # of sessions to populate above the fold
		params.sections = '0,1,2';
	}

	if (request.state.wikicities_session) {
		params.headers = {
			'Cookie': `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	article = new Article.ArticleRequestHelper(params);

	if (path === '/' || path === '/wiki/') {
		redirectToMainPage(reply, article);
	} else {
		article.setTitle(request.params.title);
		getArticle(request, reply, article, allowCache);
	}
}

/**
 * This is used only locally, normally MediaWiki takes care of this redirect
 *
 * @param reply
 * @param article
 */
function redirectToMainPage(reply: Hapi.Response, article: Article.ArticleRequestHelper): void {
	article
		.getWikiVariables()
		.then((wikiVariables: any): void => {
			Logger.info('Redirected to main page');
			reply.redirect('/wiki/' + wikiVariables.mainPageTitle);
		})
		.catch((error: any): void => {
			Logger.error('WikiVariables error', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * Gets wiki variables and article, handles errors on both promises
 *
 * @param request
 * @param reply
 * @param article
 * @param allowCache
 */
function getArticle(request: Hapi.Request,
				 reply: Hapi.Response,
				 article: Article.ArticleRequestHelper,
				 allowCache: boolean): void {
	var generalServerErrorCode = 500;

	article
		.getFull()
		.then((data: any): void => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			onArticleResponse(request, reply, data, allowCache);
		})
		.catch(Article.WikiVariablesRequestError, (error: any): void => {
			Logger.error('WikiVariables error', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		.catch(Article.ArticleRequestError, (error: any): void => {
			var data = error.data,
				errorCode = data.exception.code || generalServerErrorCode;

			Logger.error('Article error', data.exception);

			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

			// Clean up exception to not put its details in HTML response
			delete data.exception.details;

			onArticleResponse(request, reply, data, allowCache, errorCode);
		})
		.catch(Utils.RedirectedToCanonicalHost, (): void => {
			Logger.info('Redirected to canonical host');
		})
		.catch((error: any): void => {
			Logger.error('Fatal error, blame devs', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param reply
 * @param result
 * @param code
 * @param allowCache
 */
function onArticleResponse (
	request: Hapi.Request,
	reply: any,
	result: any = {},
	allowCache: boolean = true,
	code: number = 200): void {
		var response: Hapi.Response;

		Tracking.handleResponse(result, request);

		// @TODO CONCF-761 decouple logic for main page and article. Move common part to another file.
		if (result.article.isMainPage) {
			prepareMainPageData(request, result);
		} else {
			prepareArticleData(request, result);
		}

		// all the third party scripts we don't want to load on noexternals
		if (!result.queryParams.noexternals) {
			// qualaroo
			if (localSettings.qualaroo.enabled) {
				result.qualarooScript = localSettings.qualaroo.scriptUrl;
			}
		}

		response = reply.view('article', result);
		response.code(code);
		response.type('text/html; charset=utf-8');

		if (allowCache) {
			return Caching.setResponseCaching(response, cachingTimes);
		}
		return Caching.disableCache(response);
}

export = showArticle;
