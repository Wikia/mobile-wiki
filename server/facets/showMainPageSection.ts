/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../lib/Article.ts" />

import Article = require('../lib/Article');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import Caching = require('../lib/Caching');
import localSettings = require('../../config/localSettings');
import MW = require('../lib/MediaWiki');
import wrapResult = require('./api/presenters/wrapResult');
import prepareSectionData = require('./operations/prepareSectionData');


var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

function showMainPageSection (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		params = {
			wikiDomain: wikiDomain,
			sectionName: request.params.sectionName || null
		},
		article: Article.ArticleRequestHelper,
		allowCache = true;

	article = new Article.ArticleRequestHelper(params);

	article.getWikiVariables((error: any, wikiVariables: any) => {
		if (error) {
			// TODO check error.statusCode and react accordingly
			reply.redirect(localSettings.redirectUrlOnNoData);
		} else {
			article.setTitle(wikiVariables.mainPageTitle);
			article.getSection(wikiVariables, (error: any, result: any = {}) => {
				onArticleResponse(request, reply, error, result, allowCache);
			});
		}
	});
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 */
function onArticleResponse (request: Hapi.Request, reply: any, error: any, result: any = {}, allowCache: boolean = true): void {
	var code = 200,
		response: Hapi.Response,
		result = result;

	result.article = result.pageData.articleData;
	result.sectionData = result.pageData.sectionData;

	delete result.pageData;

	if (!result.wiki.dbName) {
		//if we have nothing to show, redirect to our fallback wiki
		reply.redirect(localSettings.redirectUrlOnNoData);
	} else if (!result.sectionData.items || result.sectionData.items.length < 1) {
		//if no items for section - most probable section doesn't exist - redirect to main page
		reply.redirect('/');
	} else {
		//@TODO fix tracking not being exported
		Tracking.handleResponse(result, request);

		if (error) {
			code = error.code || error.statusCode || 500;
			result.error = JSON.stringify(error);

			if (code === 404) {
				reply.redirect('/');
			}
		}

		prepareSectionData(request, result);

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

		if (allowCache) {
			return Caching.setResponseCaching(response, cachingTimes);
		}
		return Caching.disableCache(response);
	}
}

export = showMainPageSection;
