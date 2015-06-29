/// <reference path="../../typings/mercury/mercury-server.d.ts" />

import util = require('util');
import Promise = require('bluebird');
import MediaWiki = require('./MediaWiki');
import Utils = require('./Utils');
import logger = require('./Logger');
import localSettings = require('../../config/localSettings');


export class MainPageRequestHelper {
	params: MainPageRequestParams;

	constructor(params: MainPageRequestParams) {
		this.params = params;
	}

	getCategory(wikiVariables: any, next: Function): void {
		this.getCategoryData((error: any, pageData: any) => {
			next(error, {
				server: this.createServerData(this.params.wikiDomain),
				wiki: wikiVariables || {},
				pageData: pageData || {}
			});
		}, false);
	}

	getSection(wikiVariables: any, next: Function): void {
		this.getSectionData((error: any, pageData: any) => {
			next(error, {
				server: this.createServerData(this.params.wikiDomain),
				wiki: wikiVariables || {},
				pageData: pageData || {}
			});
		}, false);
	}

	private processRequests(requests: any, callback: Function, getWikiVariables: boolean) {
		Promise.settle(requests)
			.then((results:Promise.Inspection<Promise<any>>[]) => {
				var gridDataPromise:Promise.Inspection<Promise<any>> = results[0],
					articlePromise:Promise.Inspection<Promise<any>> = results [1],
					wikiPromise:Promise.Inspection<Promise<any>> = results[2],
					gridData:any,
					articleData:any,
					pageData:any = {},
					wikiVariables:any = {};

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				gridData = gridDataPromise.isFulfilled() ?
					gridDataPromise.value() :
					gridDataPromise.reason();

				pageData.gridData = gridData;

				if (getWikiVariables) {
					wikiVariables = wikiPromise.isFulfilled() ?
						wikiPromise.value() :
						wikiPromise.reason();
				}

				articleData = articlePromise.isFulfilled() ?
					articlePromise.value() :
					articlePromise.reason();

				pageData.articleData = articleData.data;

				callback(gridData.exception, pageData, wikiVariables.data);
			});
	}

	private getSectionData(callback:Function, getWikiVariables:boolean = false):void {
		var requests = [];

		logger.debug(this.params, 'Fetching section data');
		requests.push(new MediaWiki.ArticleRequest(this.params).curatedContentSection(this.params.sectionName));

		requests = this.fetchArticleData(requests);
		if (getWikiVariables) {
			requests = this.fetchWikiVariables(requests);
		}

		this.processRequests(requests, callback, getWikiVariables);

	}

	private getCategoryData(callback:Function, getWikiVariables:boolean = false):void {
		var requests = [];

		logger.debug(this.params, 'Fetching category data');
		requests.push(
			new MediaWiki.ArticleRequest(this.params).category(this.params.categoryName, {
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

	private fetchArticleData(requests: any): any {
		logger.debug(this.params, 'Fetching article data');
		requests.push(
			new MediaWiki.ArticleRequest(this.params).article(this.params.title, this.params.redirect)
		);

		return requests;
	}

	private fetchWikiVariables(requests: any): any {
		logger.debug({wiki: this.params.wikiDomain}, 'Fetching wiki variables');
		requests.push(new MediaWiki.WikiRequest({
			wikiDomain: this.params.wikiDomain
		}).getWikiVariables());

		return requests;
	}

	//@TODO shared between Article.ts and MainPage.ts - should be moved
	private createServerData(wikiDomain: string = ''): ServerData {
		var env = localSettings.environment;

		return {
			mediawikiDomain: Utils.getWikiDomainName(localSettings, wikiDomain),
			apiBase: localSettings.apiBase,
			environment: Utils.getEnvironmentString(env),
			cdnBaseUrl: (env === Utils.Environment.Prod) ||
			(env === Utils.Environment.Sandbox) ?
				localSettings.cdnBaseUrl : ''
		};
	}

	/**
	 * Get WikiVariables
	 * @param {Function} next
	 */
	//@TODO shared between Article.ts and MainPage.ts - should be moved
	getWikiVariables(next: Function): void {
		var wikiRequest = new MediaWiki.WikiRequest(this.params);

		logger.debug(this.params, 'Fetching wiki variables');

		wikiRequest
			.getWikiVariables()
			.then((wikiVariables: any) => {
				next(null, wikiVariables.data);
			}, (error: any) => {
				next(error, null);
			});
	}

	//@TODO shared between Article.ts and MainPage.ts - should be moved
	setTitle(title: string): void {
		this.params.title = title;
	}
}
