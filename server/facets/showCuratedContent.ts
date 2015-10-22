/// <reference path="../../typings/hapi/hapi.d.ts" />

import Logger = require('../lib/Logger');
import MainPage = require('../lib/MainPage');
import MediaWiki = require('../lib/MediaWiki');
import Utils = require('../lib/Utils');
import localSettings = require('../../config/localSettings');
import prepareCuratedContentData = require('./operations/prepareCuratedContentData');
import Promise = require('bluebird');
import Caching = require('../lib/Caching');
import Tracking = require('../lib/Tracking');

var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

export function category (request: Hapi.Request, reply: Hapi.Response): void {
	fetchData(request, reply);
}

export function section (request: Hapi.Request, reply: Hapi.Response): void {
	fetchData(request, reply);
}

function fetchData(request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request),
		params: ArticleRequestParams = {
			wikiDomain: wikiDomain
		},
		mainPage: MainPage.MainPageRequestHelper,
		allowCache = true;

	if (request.state.wikicities_session) {
		params.headers = {
			'Cookie': `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	mainPage = new MainPage.MainPageRequestHelper(params);

	mainPage.setTitle(request.params.title);
	mainPage.getWikiVariablesAndDetails()
		.then((data: CuratedContentPageData): void => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			outputResponse(request, reply, data, allowCache);
		})
		.catch(MainPage.MainPageDataRequestError, (error: any) => {
			var data: CuratedContentPageData = error.data;
			Logger.error('Error when fetching ads context and article details', data.mainPageData.exception);
			outputResponse(request, reply, data, false);
		})
		.catch(MediaWiki.WikiVariablesRequestError, (error: any): void => {
			Logger.error('Error when fetching wiki variables', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
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
						data: CuratedContentPageData,
						allowCache: boolean = true,
						code: number = 200): void {
	var response: Hapi.Response,
		result: any;

	if (!data.wikiVariables.dbName) {
		//if we have nothing to show, redirect to our fallback wiki
		reply.redirect(localSettings.redirectUrlOnNoData);
	}

	result = prepareCuratedContentData(request, data);

	// @TODO XW-596 we shouldn't rely on side effects of this function
	Tracking.handleResponse(result, request);

	response = reply.view('application', result);
	response.code(code);
	response.type('text/html; charset=utf-8');

	if (allowCache) {
		return Caching.setResponseCaching(response, cachingTimes);
	}

	return Caching.disableCache(response);
}
