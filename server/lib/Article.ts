/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/mercury/mercury-server.d.ts" />
/// <reference path="../lib/Utils.ts" />

/**
 * @description Article controller
 * @TODO CONCF-761 ArticleRequestHelper and MainPageRequestHelper are sharing couple of functionalities.
 * Commoon part should be extracted and moved to new class WikiaRequestHelper(?)
 */
import util = require('util');
import Promise = require('bluebird');
import MediaWiki = require('./MediaWiki');
import Utils = require('./Utils');
import logger = require('./Logger');
import localSettings = require('../../config/localSettings');

export class ArticleRequestHelper {
	params: ArticleRequestParams;

	constructor(params: ArticleRequestParams) {
		this.params = params;
	}

	setTitle(title: string): void {
		this.params.title = title;
	}

	/**
	 * Gets wiki variables and article, returns a promise which is resolved with object containing all the data.
	 */
	getFull(): Promise<any> {
		var requests = [
			new MediaWiki.ArticleRequest(this.params)
				.article(this.params.title, this.params.redirect, this.params.sections),
			new MediaWiki.WikiRequest({
				wikiDomain: this.params.wikiDomain
			}).wikiVariables()
		];

		logger.debug(this.params, 'Fetching wiki variables and article');

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
		return Promise.settle(requests)
			.then((results: Promise.Inspection<Promise<any>>[]) => {
				var articlePromise: Promise.Inspection<Promise<any>> = results[0],
					wikiPromise: Promise.Inspection<Promise<any>> = results[1],
					article: any,
					wikiVariables: any;

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				article = articlePromise.isFulfilled() ?
					articlePromise.value() :
					articlePromise.reason();

				wikiVariables = wikiPromise.isFulfilled() ?
					wikiPromise.value() :
					wikiPromise.reason();

				return {
					article: article.data,
					exception: article.exception,
					server: Utils.createServerData(localSettings, this.params.wikiDomain),
					wiki: wikiVariables
				};
			});
	}

	/**
	 * Gets wiki variables, returns a promise which is resolved with the data.
	 */
	getWikiVariables(): Promise<any> {
		var wikiRequest = new MediaWiki.WikiRequest(this.params);

		logger.debug(this.params, 'Fetching wiki variables');

		return wikiRequest.wikiVariables();
	}

	/**
	 * Gets article, returns a promise which is resolved with the data.
	 */
	getArticle(): Promise<any> {
		var articleRequest = new MediaWiki.ArticleRequest(this.params);

		logger.debug(this.params, 'Fetching article');

		return articleRequest.article(this.params.title, this.params.redirect, this.params.sections);
	}

	getArticleRandomTitle(next: Function): void {
		var articleRequest = new MediaWiki.ArticleRequest(this.params);

		articleRequest
			.randomTitle()
			.then((result: any): void => {
				var articleId: string,
					pageData: { pageid: number; ns: number; title: string };

				if (result.query && result.query.pages) {
					articleId = Object.keys(result.query.pages)[0];
					pageData = <any>result.query.pages[articleId];

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
}
