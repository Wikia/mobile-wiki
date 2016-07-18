import {resolve, reject, settle} from 'bluebird';
import * as MediaWiki from './mediawiki';
import {createServerData} from './utils';
import {PageRequestError} from './custom-errors';
import logger from './logger';
import localSettings from '../../config/localSettings';

/**
 * @todo XW-608 move setTitile to common part for CuratedMainPageRequestHelper and PageRequestHelper
 * Common part should be extracted and moved to new class WikiaRequestHelper(?)
 */

/**
 * @class PageRequestHelper
 * @property {PageRequestParams} params
 */
export class PageRequestHelper {
	/**
	 * @param {PageRequestParams} params
	 * @returns {void}
	 */
	constructor(params) {
		this.params = params;
	}

	/**
	 * @param {string} title
	 * @returns {void}
	 */
	setTitle(title) {
		this.params.title = title;
	}

	/**
	 * Gets wiki variables and article, returns a promise which is resolved with object containing all the data.
	 *
	 * @returns {Promise<MediaWikiPageData>}
	 */
	getFull() {
		const requests = [
			new MediaWiki.PageRequest(this.params)
				.page(this.params.title, this.params.redirect, this.params.sections),
			new MediaWiki.WikiRequest({
				wikiDomain: this.params.wikiDomain
			}).wikiVariables(),
			new MediaWiki.DesignSystemRequest(this.params).getFooter()
		];

		logger.debug(this.params, 'Fetching wiki variables and mediawiki page');

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
			 * @param {Promise.Inspection<Promise<MediaWikiPageData>>[]} results
			 * @returns {void}
			 */
			.then((results) => {
				const mediaWikiPagePromise = results[0],
					wikiVariablesPromise = results[1],
					globalFooterPromise = results[2],
					isMediaWikiPagePromiseFulfilled = mediaWikiPagePromise.isFulfilled(),
					isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled();

				let page,
					data,
					globalFooter;

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				page = isMediaWikiPagePromiseFulfilled ?
					mediaWikiPagePromise.value() :
					mediaWikiPagePromise.reason();

				if (!isWikiVariablesPromiseFulfilled) {
					return reject(wikiVariablesPromise.reason());
				}

				globalFooter = globalFooterPromise.isFulfilled() ? globalFooterPromise.value() : {};

				data = {
					page,
					server: createServerData(localSettings, this.params.wikiDomain),
					wikiVariables: wikiVariablesPromise.value(),
					globalFooter
				};

				if (isMediaWikiPagePromiseFulfilled && page) {
					return resolve(data);
				} else {
					// Even if article promise failed we want to display app using the rest of data
					return reject(new PageRequestError(data));
				}
			});
	}

	/**
	 * Gets wiki variables, returns a promise which is resolved with the data.
	 *
	 * @returns {Promise}
	 */
	getWikiVariables() {
		const wikiRequest = new MediaWiki.WikiRequest(this.params);

		logger.debug(this.params, 'Fetching wiki variables');

		return wikiRequest.wikiVariables();
	}

	/**
	 * Gets article, returns a promise which is resolved with the data.
	 *
	 * @returns {Promise<ArticleResponse>}
	 */
	getArticleFromMarkup() {
		const mediaWikiPageRequest = new MediaWiki.PageRequest(this.params);

		logger.debug(this.params, 'Fetching article from markup');

		return mediaWikiPageRequest.articleFromMarkup(this.params.title, this.params.wikitext, this.params.CKmarkup);
	}
}
