/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/mercury/mercury-server.d.ts" />
/// <reference path="../lib/Utils.ts" />

/**
 * @description Article controller
 * @TODO XW-608 move setTitile to common part for CuratedMainPageRequestHelper and ArticleRequestHelper
 * Common part should be extracted and moved to new class WikiaRequestHelper(?)
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
	getFull(): Promise<ArticlePageData> {
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
			.then((results: Promise.Inspection<Promise<ArticlePageData>>[]) => {
				var articlePromise: Promise.Inspection<Promise<any>> = results[0],
					wikiVariablesPromise: Promise.Inspection<Promise<any>> = results[1],
					isArticlePromiseFulfilled = articlePromise.isFulfilled(),
					isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled(),
					article: ArticleResponse|MWException,
					wikiVariables: any|MWException,
					data: ArticlePageData;

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				article = isArticlePromiseFulfilled ?
					articlePromise.value() :
					articlePromise.reason();

				wikiVariables = isWikiVariablesPromiseFulfilled ?
					wikiVariablesPromise.value() :
					wikiVariablesPromise.reason();

				if (!isWikiVariablesPromiseFulfilled) {
					return Promise.reject(new MediaWiki.WikiVariablesRequestError(wikiVariables));
				}

				data = {
					article,
					server: Utils.createServerData(localSettings, this.params.wikiDomain),
					wikiVariables
				};

				if (isArticlePromiseFulfilled) {
					return Promise.resolve(data);
				} else {
					// Even if article promise failed we want to display app using the rest of data
					return Promise.reject(new ArticleRequestError(data));
				}
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
	getArticle(): Promise<ArticleResponse> {
		var articleRequest = new MediaWiki.ArticleRequest(this.params);

		logger.debug(this.params, 'Fetching article');

		return articleRequest.article(this.params.title, this.params.redirect, this.params.sections);
	}

	getArticleRandomTitle(): Promise<any> {
		var articleRequest = new MediaWiki.ArticleRequest(this.params);

		return articleRequest
			.randomTitle()
			.then((result: any): Promise<any> => {
				var articleId: string,
					pageData: { pageid: number; ns: number; title: string };

				if (result.query && result.query.pages) {
					articleId = Object.keys(result.query.pages)[0];
					pageData = <any>result.query.pages[articleId];

					return Promise.resolve({
						title: pageData.title
					});
				} else {
					return Promise.reject(result.exception);
				}
			});
	}
}

export class ArticleRequestError {
	private data: ArticlePageData;

	constructor(data: ArticlePageData) {
		Error.apply(this, arguments);
		this.data = data;
	}
}

ArticleRequestError.prototype = Object.create(Error.prototype);
