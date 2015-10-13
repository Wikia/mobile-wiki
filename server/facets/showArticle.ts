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
		article
			.getWikiVariables()
			.then((wikiVariables: any): Promise<any> => {
				Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables);
				article.setTitle(wikiVariables.mainPageTitle);

				return Promise.join(wikiVariables, article.getArticle());
			})
			.spread((wikiVariables: any, article: any): void => {
				article = article.data;
				onArticleResponse(request, reply, article.exception, {
					article,
					wiki: wikiVariables
				}, allowCache);
			})
			.catch(Utils.RedirectedToCanonicalHost, (): void => {
				Logger.info('Redirected to canonical host');
			})
			.catch((error: any): void => {
				Logger.error('Error when trying to serve an article', error);
				reply.redirect(localSettings.redirectUrlOnNoData);
			});
	} else  {
		article.setTitle(request.params.title);

		article
			.getFull()
			.then((result: any) => {
				Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, result.wiki);
				onArticleResponse(request, reply, result.exception, result, allowCache);
			})
			.catch(Utils.RedirectedToCanonicalHost, (): void => {
				Logger.info('Redirected to canonical host');
			});
	}
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 * @param allowCache
 */
function onArticleResponse (
	request: Hapi.Request,
	reply: any,
	error: any,
	result: any = {},
	allowCache: boolean = true): void {
		var code = 200,
			response: Hapi.Response;

		if (!result.article.details && !result.wiki.dbName) {
			//if we have nothing to show, redirect to our fallback wiki
			reply.redirect(localSettings.redirectUrlOnNoData);
		} else {
			Tracking.handleResponse(result, request);

			if (error) {
				code = error.code || error.statusCode || 500;
				result.error = JSON.stringify(error);
			}

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
}

export = showArticle;
