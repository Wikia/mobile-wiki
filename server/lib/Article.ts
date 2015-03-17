/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/mercury/mercury-server.d.ts" />

/**
 * @description Article controller
 */
import util = require('util');
import Promise = require('bluebird');
import MediaWiki = require('./MediaWiki');
import Utils = require('./Utils');
import logger = require('./Logger');
import localSettings = require('../../config/localSettings');

interface ServerData {
	mediawikiDomain: string;
	apiBase: string;
	environment: string;
}

/**
 * Create server data
 *
 * @returns ServerData
 */
function createServerData (): ServerData {
	return {
		mediawikiDomain: Utils.getWikiDomainName(localSettings),
		apiBase: localSettings.apiBase,
		environment: Utils.getEnvironmentString(localSettings.environment),
		cdnBaseUrl: localSettings.environment === Utils.Environment.Prod ? localSettings.cdnBaseUrl : ''
	};
}

/**
 * Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 *
 * @param {ArticleRequestParams} params
 * @param {Function} callback
 * @param {boolean} getWikiVariables whether or not to make a WikiRequest to get information about the wiki
 */
export function getData (params: ArticleRequestParams, callback: Function, getWikiVariables: boolean = false): void {
	var requests = [
			new MediaWiki.ArticleRequest(params.wikiDomain).article(params.title, params.redirect)
		];

	logger.debug(params, 'Fetching article');

	if (getWikiVariables) {
		logger.debug({wiki: params.wikiDomain}, 'Fetching wiki variables');

		requests.push(new MediaWiki.WikiRequest({
			wikiDomain: params.wikiDomain
		}).getWikiVariables());
	}

	/**
	 * @see https://github.com/petkaantonov/bluebird/blob/master/API.md#settle---promise
	 *
	 * From Promise.settle documentation:
	 * Given an array, or a promise of an array, which contains promises (or a mix of promises and values)
	 * return a promise that is fulfilled when all the items in the array are either fulfilled or rejected.
	 * The fulfillment value is an array of PromiseInspection instances at respective positions in relation
	 * to the input array. This method is useful for when you have an array of promises and you'd like to know
	 * when all of them resolve - either by fulfilling of rejecting.
	 */
	Promise.settle(requests)
		.then((results: Promise.Inspection<Promise<any>>[]) => {
			var articlePromise: Promise.Inspection<Promise<any>> = results[0],
				wikiPromise: Promise.Inspection<Promise<any>> = results[1],
				article: any,
				wikiVariables: any = {};

			// if promise is fulfilled - use resolved value, if it's not - use rejection reason
			article = articlePromise.isFulfilled() ?
				articlePromise.value() :
				articlePromise.reason();

			if (getWikiVariables) {
				wikiVariables = wikiPromise.isFulfilled() ?
					wikiPromise.value() :
					wikiPromise.reason();
			}

			callback(article.exception, article.data, wikiVariables.data);
		});
}

/**
 * Handle full page data generation
 * @param {ArticleRequestParams} params
 * @param {Function} next
 */
export function getFull (params: ArticleRequestParams, next: Function): void {
	getData(params, (error: any, article: any, wikiVariables: any) => {
		next(error, {
			server: createServerData(),
			wiki: wikiVariables || {},
			article: article || {}
		});
	}, true);
}

/**
 * Handle preview page data generation
 * @param {ArticleRequestParams} params
 * @param {string} parserOutput
 * @param {Function} next
 */
export function getPreview (params: ArticleRequestParams, parserOutput: any, next: Function): void {
	getWikiVariables(params.wikiDomain, (error: any, wikiVariables: any) => {
		var article = {
			article: parserOutput,
			adsContext: {},
			details: {
				id: 0,
				title: params.title, //TODO: encode!!!!
				revision: {},
				type: 'article'
			}
		};

		next(error, {
			server: createServerData(),
			wiki: wikiVariables || {},
			article: article
		});
	});
}

/**
 * Get WikiVariables
 * @param {string} wikiDomain
 * @param {Function} next
 */
export function getWikiVariables (wikiDomain: string, next: Function): void {
	var wikiRequest = new MediaWiki.WikiRequest({
		wikiDomain: wikiDomain
	});

	logger.debug({wiki: wikiDomain}, 'Fetching wiki variables');

	wikiRequest
		.getWikiVariables()
		.then((wikiVariables: any) => {
			next(null, wikiVariables.data);
		}, (error: any) => {
			next(error, null);
		});
}

/**
 * Handle article page data generation, no need for WikiVariables
 * @param {ArticleRequestParams} params
 * @param {*} wikiVariables
 * @param {Function} next
 */
export function getArticle (params: ArticleRequestParams, wikiVariables: any, next: Function): void {
	getData(params, (error: any, article: any) => {
		next(error, {
			server: createServerData(),
			wiki: wikiVariables || {},
			article: article || {}
		});
	}, false);
}

export function getArticleRandomTitle (wikiDomain: string, next: Function): void {
	var articleRequest = new MediaWiki.ArticleRequest(wikiDomain);

	articleRequest
		.randomTitle()
		.then((result: any): void => {
			var articleId: string,
				pageData: { pageid: number; ns: number; title: string };

			if (result.query && result.query.pages) {
				articleId = Object.keys(result.query.pages)[0];
				pageData = result.query.pages[articleId];

				next(null, {
					title: pageData.title
				});
			} else {
				next(result.error, null);
			}
		}, (error: any): void => {
			next(error, null);
		});
}
