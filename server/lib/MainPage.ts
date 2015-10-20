/// <reference path="../../typings/mercury/mercury-server.d.ts" />

import Promise = require('bluebird');
import MediaWiki = require('./MediaWiki');
import Utils = require('./Utils');
import logger = require('./Logger');
import localSettings = require('../../config/localSettings');

/**
 * @TODO CONCF-761 ArticleRequestHelper and MainPageRequestHelper are sharing couple of functionalities.
 * Commoon part should be extracted and moved to new class WikiaRequestHelper(?)
 */
export class MainPageRequestHelper {
	params: MainPageRequestParams;

	constructor(params: MainPageRequestParams) {
		this.params = params;
	}


	/**
	 * @param {Array} requests - array of requests to process
	 */
	private processRequests(requests: any): Promise<any> {
		return Promise.settle(requests)
			.then((results: Promise.Inspection<Promise<any>>[]) => {
				var curatedContentPromise: Promise.Inspection<Promise<any>> = results[0],
					mainPageDetailsAndAdsContextPromise: Promise.Inspection<Promise<any>> = results [1],
					pageData: any = {};

				if (!curatedContentPromise.isFulfilled()) {
					return Promise.reject(new GetCuratedContentRequestError(curatedContentPromise.reason()));
				}

				pageData.curatedContent = curatedContentPromise.value();

				if (!mainPageDetailsAndAdsContextPromise.isFulfilled()) {
					pageData.exception = mainPageDetailsAndAdsContextPromise.reason().exception;
					return Promise.reject(new GetMainPageDataRequestError(pageData));
				}
				pageData.mainPageData = mainPageDetailsAndAdsContextPromise.value();

				return Promise.resolve(pageData);
			});
	}

	getSection(): Promise<any> {
		var requests: any = [];

		logger.debug(this.params, 'Fetching section data');

		requests.push(new MediaWiki.ArticleRequest(this.params).curatedContentSection(this.params.sectionName));
		requests.push(this.fetchMainPageDetailsAndAdsContext());

		return this.processRequests(requests);
	}

	getCategory(): Promise<any> {
		var requests: any = [];

		logger.debug(this.params, 'Fetching category data');
		requests.push(new MediaWiki.ArticleRequest(this.params).category(this.params.categoryName, {
			//set the default values for thumbnail - take from: server/facets/api/category.ts:22
			width: 300,
			height: 300
		}));

		requests.push(this.fetchMainPageDetailsAndAdsContext());

		return this.processRequests(requests);
	}

	/**
	 * Create MW request for article data and return array with request
	 * @returns {Array} array of requests
	 */
	private fetchMainPageDetailsAndAdsContext(): Promise<any> {
		logger.debug(this.params, 'Fetching Main Page details and ads context');
		return new MediaWiki.ArticleRequest(this.params).mainPageDetailsAndAdsContext();
	}

	/**
	 * @TODO shared between Article.ts and MainPage.ts - should be moved
	 * @param wikiDomain
	 * @returns {{mediawikiDomain: string, apiBase: string, environment: string, cdnBaseUrl: string}}
	 */
	static createServerData(wikiDomain: string = ''): ServerData {
		var env = localSettings.environment;

		return {
			mediawikiDomain: Utils.getWikiDomainName(localSettings, wikiDomain),
			apiBase: localSettings.apiBase,
			environment: Utils.getEnvironmentString(env),
			cdnBaseUrl: Utils.getCDNBaseUrl(localSettings)
		};
	}

	/**
	 * Get WikiVariables
	 * @TODO CONCF-761 shared between Article.ts and MainPage.ts - should be moved
	 */
	getWikiVariables(): any {
		var wikiRequest = new MediaWiki.WikiRequest(this.params);

		logger.debug(this.params, 'Fetching wiki variables');

		return wikiRequest.wikiVariables();
	}

	/**
	 * @TODO CONCF-761 shared between Article.ts and MainPage.ts - should be moved
	 * @param title
	 */
	setTitle(title: string): void {
		this.params.title = title;
	}
}

export class GetCuratedContentRequestError {
	private data: any;

	constructor(data: any) {
		Error.apply(this, arguments);
		this.data = data;
	}
}
GetCuratedContentRequestError.prototype = Object.create(Error.prototype);

export class GetMainPageDataRequestError {
	private data: any;

	constructor(data: any) {
		Error.apply(this, arguments);
		this.data = data;
	}
}
GetMainPageDataRequestError.prototype = Object.create(Error.prototype);
