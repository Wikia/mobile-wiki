import {resolve, reject, settle} from 'bluebird';
import * as MediaWiki from './MediaWiki';
import {createServerData} from './Utils';
import logger from './Logger';
import localSettings from '../../config/localSettings';

/**
 * @todo XW-608 move setTitile to common part for CuratedMainPageRequestHelper and ArticleRequestHelper
 * Commoon part should be extracted and moved to new class WikiaRequestHelper(?)
 */

/**
 * @class MainPageDataRequestError
 */
export class MainPageDataRequestError {
	/**
	 * @param {*} data
	 * @returns {void}
	 */
	constructor(data) {
		Error.apply(this, arguments);
		this.data = data;
	}
}
MainPageDataRequestError.prototype = Object.create(Error.prototype);

/**
 * @class CuratedMainPageRequestHelper
 * @property {ArticleRequestParams} params
 */
export class CuratedMainPageRequestHelper {

	/**
	 * @param {ArticleRequestParams} params
	 * @returns {void}
	 */
	constructor(params) {
		this.params = params;
	}

	/**
	 * @todo XW-608 shared between Article.ts and MainPage.ts - should be moved
	 * @param {string} title
	 * @returns {void}
	 */
	setTitle(title) {
		this.params.title = title;
	}

	/**
	 * @returns {Promise<CuratedContentPageData>}
	 */
	getWikiVariablesAndDetails() {
		const requests = [
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
		return settle(requests)
			/**
			 * @param {Promise.Inspection<Promise<CuratedContentPageData>>[]} results
			 * @returns {void}
			 */
			.then((results) => {
				const mainPageDataPromise = results[0],
					wikiVariablesPromise = results[1],
					isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled();

				let mainPageData,
					mainPageDataException,
					wikiVariables;

				if (mainPageDataPromise.isFulfilled()) {
					mainPageData = mainPageDataPromise.value();
				} else {
					mainPageDataException = mainPageDataPromise.reason();
				}

				wikiVariables = isWikiVariablesPromiseFulfilled ?
					wikiVariablesPromise.value() :
					wikiVariablesPromise.reason();

				if (!isWikiVariablesPromiseFulfilled) {
					return reject(new MediaWiki.WikiVariablesRequestError(wikiVariables));
				}

				if (mainPageData && mainPageData.data) {
					return resolve({
						mainPageData: mainPageData.data,
						wikiVariables,
						server: createServerData(localSettings, this.params.wikiDomain)
					});
				} else {
					return reject(new MainPageDataRequestError({
						exception: mainPageDataException,
						wikiVariables,
						server: createServerData(localSettings, this.params.wikiDomain)
					}));
				}
			});
	}
}
