import Utils = require('../../lib/Utils');
import Tracking = require('../../lib/Tracking');
import Caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');
var deepExtend = require('deep-extend');

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
function prepareData(request: Hapi.Request, result: any): void {
	var title: string,
		contentDir = 'ltr',
		mainPageDetails = result.mainPage.details,
		wikiVariables = result.wikiVariables;

	/**
	 * Title is double encoded because Ember's RouteRecognizer does decodeURI while processing path.
	 * See the MainPageRoute for more details.
	 */
	if (request.url.path.indexOf('section') > -1) {
		title = decodeURIComponent(decodeURI(request.url.path.replace('\/main\/section\/', '')));
		title = title.replace(/%20/g, ' ');
	} else if (request.url.path.indexOf('category') > -1) {
		title = decodeURIComponent(decodeURI(request.url.path.replace('\/main\/category\/', '')));
		title = title.replace(/_/g, ' ');
	} else {
		title = wikiVariables.mainPageTitle.replace(/_/g, ' ');
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.displayTitle = title;
	result.isMainPage = true;
	result.canonicalUrl = wikiVariables.basePath + '/';
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, ['noexternals', 'buckysampling']);
	result.openGraph = {
		type: 'website',
		title: result.wikiVariables.siteName,
		url: result.canonicalUrl
	};

	if (result.mainPageData && mainPageDetails) {
		result.mainPageData.ns = mainPageDetails.ns;

		if (result.mainPageData.details.abstract) {
			result.openGraph.description = mainPageDetails.abstract;
		}

		if (result.mainPageData.details.thumbnail) {
			result.openGraph.image = mainPageDetails.thumbnail;
		}
	}

	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = deepExtend({}, localSettings);

	if (request.query.buckySampling !== undefined) {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
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
 * @param {CuratedContentPageData} curatedContentPageData
 * @param allowCache
 * @param code
 */
function processCuratedContentData (
	request: Hapi.Request, reply: any, curatedContentPageData: CuratedContentPageData, allowCache: boolean = true, code: number = 200
): void {
	var response: Hapi.Response,
		result: any = curatedContentPageData || {};

	if (!curatedContentPageData.wikiVariables.dbName) {
		//if we have nothing to show, redirect to our fallback wiki
		reply.redirect(localSettings.redirectUrlOnNoData);
	} else {
		Tracking.handleResponse(result, request);

		//@TODO unify with code from XW-474 prepareArticleData function
		prepareData(request, result);

		// all the third party scripts we don't want to load on noexternals
		if (!result.queryParams.noexternals) {
			// qualaroo
			if (localSettings.qualaroo.enabled) {
				result.qualarooScript = localSettings.qualaroo.scriptUrl;
			}
		}

		//@TODO Should be removed when XW-474 merged to dev
		result.wiki = result.wikiVariables;

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
