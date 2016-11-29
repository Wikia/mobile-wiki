import {resolve, reject, settle} from 'bluebird';
import * as MediaWiki from './mediawiki';
import {createServerData} from './utils';
import {MainPageDataRequestError} from '../lib/custom-errors';
import logger from './logger';
import settings from '../../config/settings';

/**
 * @todo XW-608 move setTitile to common part for CuratedMainPageRequestHelper and MediaWikiPageRequestHelper
 * Common part should be extracted and moved to new class WikiaRequestHelper(?)
 */

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
			new MediaWiki.PageRequest(this.params).mainPageDetailsAndAdsContext(),
			new MediaWiki.WikiRequest({wikiDomain: this.params.wikiDomain}).wikiVariables()
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
					mainPageDataException;

				if (mainPageDataPromise.isFulfilled()) {
					mainPageData = mainPageDataPromise.value();
				} else {
					mainPageDataException = mainPageDataPromise.reason();
				}

				if (!isWikiVariablesPromiseFulfilled) {
					return reject(wikiVariablesPromise.reason());
				}

				if (mainPageData && mainPageData.data) {
					return resolve({
						mainPageData: mainPageData.data,
						wikiVariables: wikiVariablesPromise.value(),
						server: createServerData(settings, this.params.wikiDomain)
					});
				} else {
					return reject(new MainPageDataRequestError({
						exception: mainPageDataException,
						wikiVariables: wikiVariablesPromise.value(),
						server: createServerData(settings, this.params.wikiDomain)
					}));
				}
			});
	}
}
