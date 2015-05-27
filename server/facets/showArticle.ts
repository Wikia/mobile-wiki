/// <reference path="../../typings/hapi/hapi.d.ts" />

import Article = require('../lib/Article');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import Caching = require('../lib/Caching');
import localSettings = require('../../config/localSettings');
import prepareArticleData = require('./operations/prepareArticleData');

var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

function showArticle (request: Hapi.Request, reply: Hapi.Response): void {
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

		prepareArticleData(request, result);

		// all the third party scripts we don't want to load on noexternals
		if (!result.queryParams.noexternals) {
			// optimizely
			if (localSettings.optimizely.enabled) {
				result.optimizelyScript = localSettings.optimizely.scriptPath +
					(localSettings.environment === Utils.Environment.Prod ?
						localSettings.optimizely.account : localSettings.optimizely.devAccount) + '.js';
			}

			// qualaroo
			if (localSettings.qualaroo.enabled) {
				result.qualarooScript = localSettings.environment === Utils.Environment.Prod ?
					localSettings.qualaroo.scriptUrlProd : localSettings.qualaroo.scriptUrlDev;
			}
		}

		response = reply.view('application', result);
		response.code(code);
		response.type('text/html; charset=utf-8');
		Caching.setResponseCaching(response, cachingTimes);
	}
}

export = showArticle;
