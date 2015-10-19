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
	 * @desc Get category items for given section name passed in params.
	 * Updated pageData inside return object with fetched data.
	 * @param wikiVariables
	 * @param next
	 */
	getCategory(wikiVariables: any, next: Function): void {
		this.getCategoryData((error: any, pageData: any) => {
			next(error, {
				server: this.createServerData(this.params.wikiDomain),
				wikiVariables: wikiVariables || {},
				pageData: pageData || {}
			});
		}, false);
	}

	/**
	 * @desc Get section items for given category name passed in params.
	 * Updated pageData inside return object with fetched data.
	 * @param wikiVariables
	 * @param next
	 */
	getSection(wikiVariables: any, next: Function): void {
		this.getSectionData((error: any, pageData: any) => {
			next(error, {
				server: this.createServerData(this.params.wikiDomain),
				wikiVariables: wikiVariables || {},
				pageData: pageData || {}
			});
		}, false);
	}

	/**
	 * @param {Array} requests - array of requests to process
	 * @param {Function} callback - callback which should be called with data from requests
	 * @param {boolean} getWikiVariables - flag if wiki's variables should be fetched
	 */
	private processRequests(requests: any, callback: Function, getWikiVariables: boolean): void {
		Promise.settle(requests)
			.then((results: Promise.Inspection<Promise<any>>[]) => {
				var curatedContentPromise: Promise.Inspection<Promise<any>> = results[0],
					articlePromise: Promise.Inspection<Promise<any>> = results [1],
					wikiPromise: Promise.Inspection<Promise<any>> = results[2],
					curatedContent: any,
					articleData: any,
					pageData: any = {},
					wikiVariables: any = {};

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				curatedContent = curatedContentPromise.isFulfilled() ?
					curatedContentPromise.value() :
					curatedContentPromise.reason();

				pageData.curatedContent = curatedContent;

				if (getWikiVariables) {
					wikiVariables = wikiPromise.isFulfilled() ?
						wikiPromise.value() :
						wikiPromise.reason();
				}

				articleData = articlePromise.isFulfilled() ?
					articlePromise.value() :
					articlePromise.reason();

				pageData.articleData = articleData.data;

				callback(curatedContent.exception, pageData, wikiVariables.data);
			});
	}

	/**
	 * @desc Fetch data for section
	 * @param {Function} callback
	 * @param {boolean} getWikiVariables
	 */
	private getSectionData(callback: Function, getWikiVariables: boolean = false): void {
		var requests: any = [];

		logger.debug(this.params, 'Fetching section data');
		requests.push(new MediaWiki.ArticleRequest(this.params).curatedContentSection(this.params.sectionName));

		requests = this.fetchArticleData(requests);
		if (getWikiVariables) {
			requests = this.fetchWikiVariables(requests);
		}

		this.processRequests(requests, callback, getWikiVariables);

	}

	/**
	 * @desc Fetch data for category
	 * @param {Function} callback
	 * @param {boolean} getWikiVariables
	 */
	private getCategoryData(callback: Function, getWikiVariables: boolean = false): void {
		var requests: any = [];

		logger.debug(this.params, 'Fetching category data');
		requests.push(
			new MediaWiki.ArticleRequest(this.params).category(this.params.categoryName, {
				//set the default values for thumbnail - take from: server/facets/api/category.ts:22
				width: 300,
				height: 300
			})
		);

		requests = this.fetchArticleData(requests);

		if (getWikiVariables) {
			requests = this.fetchWikiVariables(requests);
		}

		this.processRequests(requests, callback, getWikiVariables);
	}

	/**
	 * Create MW request for article data and return array with request
	 * @param requests
	 * @returns {Array} array of requests
	 */
	private fetchArticleData(requests: any): any {
		logger.debug(this.params, 'Fetching article data');
		requests.push(
			new MediaWiki.ArticleRequest(this.params).article(this.params.title, this.params.redirect)
		);

		return requests;
	}

	/**
	 * Create MW request for wiki variables and return array with request
	 * @param requests
	 * @returns {Array} array of requests
	 */
	private fetchWikiVariables(requests: any): any {
		logger.debug({wiki: this.params.wikiDomain}, 'Fetching wiki variables');
		requests.push(new MediaWiki.WikiRequest({
			wikiDomain: this.params.wikiDomain
		}).wikiVariables());

		return requests;
	}

	/**
	 * @TODO shared between Article.ts and MainPage.ts - should be moved
	 * @param wikiDomain
	 * @returns {{mediawikiDomain: string, apiBase: string, environment: string, cdnBaseUrl: string}}
	 */
	private createServerData(wikiDomain: string = ''): ServerData {
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
