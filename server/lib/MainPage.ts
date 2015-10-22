/// <reference path="../../typings/mercury/mercury-server.d.ts" />

import Promise = require('bluebird');
import MediaWiki = require('./MediaWiki');
import Utils = require('./Utils');
import logger = require('./Logger');
import localSettings = require('../../config/localSettings');

/**
 * @TODO XW-608 move setTitile to common part for MainPageRequestHelper and ArticleRequestHelper
 * Commoon part should be extracted and moved to new class WikiaRequestHelper(?)
 */
export class MainPageRequestHelper {
	params: ArticleRequestParams;

	constructor(params: ArticleRequestParams) {
		this.params = params;
	}

	/**
	 * @TODO XW-608 shared between Article.ts and MainPage.ts - should be moved
	 * @param title
	 */
	setTitle(title: string): void {
		this.params.title = title;
	}

	getWikiVariablesAndDetails(): any {
		var requests = [
			new MediaWiki.ArticleRequest(this.params).mainPageDetailsAndAdsContext(),
			new MediaWiki.WikiRequest({
				wikiDomain: this.params.wikiDomain
			}).wikiVariables()
		];

		logger.debug(this.params, 'Fetching wiki variables and main page details');

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
				var mainPageDataPromise: Promise.Inspection<Promise<any>> = results[0],
					wikiVariablesPromise: Promise.Inspection<Promise<any>> = results[1],
					isMainPageDataPromiseFulfilled = mainPageDataPromise.isFulfilled(),
					isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled(),
					mainPageData: any,
					wikiVariables: any,
					data: any;

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				mainPageData = isMainPageDataPromiseFulfilled ?
					mainPageDataPromise.value() :
					mainPageDataPromise.reason();

				wikiVariables = isWikiVariablesPromiseFulfilled ?
					wikiVariablesPromise.value() :
					wikiVariablesPromise.reason();

				if (!isWikiVariablesPromiseFulfilled) {
					return Promise.reject(new MediaWiki.WikiVariablesRequestError(wikiVariables));
				}

				data = {
					mainPageData,
					wikiVariables,
					server: Utils.createServerData(localSettings, this.params.wikiDomain)
				};

				if (isMainPageDataPromiseFulfilled) {
					return Promise.resolve(data);
				} else {
					return Promise.reject(new MainPageDataRequestError(data));
				}
			});
	}
}

export class MainPageDataRequestError {
	private data: any;

	constructor(data: any) {
		Error.apply(this, arguments);
		this.data = data;
	}
}
MainPageDataRequestError.prototype = Object.create(Error.prototype);
