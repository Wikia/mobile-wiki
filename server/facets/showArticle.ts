/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../lib/Article.ts" />

import Promise = require('bluebird');
import Article = require('../lib/Article');
import Caching = require('../lib/Caching');
import Logger = require('../lib/Logger');
import Tracking = require('../lib/Tracking');
import Utils = require('../lib/Utils');
import getStatusCode = require('./operations/getStatusCode');
import localSettings = require('../../config/localSettings');
import prepareArticleData = require('./operations/prepareArticleData');
import prepareMainPageData = require('./operations/prepareMainPageData');

var deepExtend = require('deep-extend');

var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

function showArticle(request: Hapi.Request, reply: Hapi.Response): void {
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
			reply.redirect(wikiVariables.articlePath + wikiVariables.mainPageTitle);
		})
		.catch((error: MWException): void => {
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
	article
		.getFull()
		.then((data: any): void => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			outputResponse(request, reply, data, allowCache);
		})
		.catch(Article.WikiVariablesRequestError, (error: MWException): void => {
			Logger.error('WikiVariables error', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		.catch(Article.ArticleRequestError, (error: any): void => {
			var data: ArticlePageData = error.data,
				errorCode = getStatusCode(data.article, 500);

			Logger.error('Article error', data.article.exception);

			// It's possible that the article promise is rejected but we still want to redirect to canonical host
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

			// Clean up exception to not put its details in HTML response
			delete data.article.exception.details;

			outputResponse(request, reply, data, allowCache, errorCode);
		})
		.catch(Utils.RedirectedToCanonicalHost, (): void => {
			Logger.info('Redirected to canonical host');
		})
		.catch((error: any): void => {
			Logger.fatal('Unhandled error, code issue', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {ArticlePageData} data
 * @param {boolean} allowCache
 * @param {number} code
 */
function outputResponse(request: Hapi.Request,
						reply: Hapi.Response,
						data: ArticlePageData,
						allowCache: boolean = true,
						code: number = 200): void {
	var response: Hapi.Response,
		result = prepareArticleData(request, data);

	if (data.article.data && data.article.data.isMainPage) {
		result = deepExtend(result, prepareMainPageData(data));
		delete result.adsContext;
	}

	// @TODO we shouldn't rely on side effects of this function
	Tracking.handleResponse(result, request);

	response = reply.view('article', result);
	response.code(code);
	response.type('text/html; charset=utf-8');

	if (allowCache) {
		return Caching.setResponseCaching(response, cachingTimes);
	}

	return Caching.disableCache(response);
}

export = showArticle;
