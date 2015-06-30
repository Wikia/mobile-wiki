import Utils = require('../../lib/Utils');
import Tracking = require('../../lib/Tracking');
import Caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');

var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

/**
 * Prepare data for template
 * @TODO CONCF-761 a lot of this code is duplicated in prepareArticleData.ts. Common part should be extracted
 * @param request
 * @param result
 */
function prepareData (request: Hapi.Request, result: any): void {
	var title: string,
		userDir = 'ltr';

	if (request.url.path.indexOf('section') > -1) {
		title = request.url.path.replace('\/main\/section\/', '');
	} else if (request.url.path.indexOf('catgory') > -1) {
		title = request.url.path.replace('\/main\/category\/', '');
	} else {
		title = result.wiki.mainPageTitle.replace(/_/g, ' ');
	}

	if (result.wiki.language) {
		userDir = result.wiki.language.userDir;
		result.isRtl = (userDir === 'rtl');
	}

	result.displayTitle = title;
	result.isMainPage = true;
	result.canonicalUrl = result.wiki.basePath + '/';
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, ['noexternals', 'buckysampling']);

	result.weppyConfig = localSettings.weppy;
	if (typeof result.queryParams.buckySampling === 'number') {
		result.weppyConfig.samplingRate = result.queryParams.buckySampling / 100;
	}

	result.userId = request.state.wikicitiesUserID ? request.state.wikicitiesUserID : 0;
}

/**
 * Handles category or section response for Curated Main Page from API
 * @TODO CONCF-761 - part after prepareData is common for Main Page and article
 * - should be moved to some common piece of code.
 * Right now article code is inside showArticle.onArticle() and showMainPage.onArticle()
 *
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 * @param allowCache
 */
function processCuratedContentData (
	request: Hapi.Request, reply: any, error: any, result: any = {}, allowCache: boolean = true
): void {
	var code = 200,
		response: Hapi.Response;

	result.article = result.pageData.articleData;
	result.gridData = result.pageData.gridData;
	delete result.pageData.gridData;

	if (!result.wiki.dbName) {
		//if we have nothing to show, redirect to our fallback wiki
		reply.redirect(localSettings.redirectUrlOnNoData);
	} else if ((error && error.code === 404) || (!result.gridData.items || result.gridData.items.length < 1)) {
		//if no items inside section or category -> redirect to main page
		reply.redirect('/');
	} else {
		Tracking.handleResponse(result, request);

		if (error) {
			code = error.code || error.statusCode || 500;
			result.error = JSON.stringify(error);
		}

		prepareData(request, result);

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

export = processCuratedContentData
