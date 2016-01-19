import {resolve, reject, settle} from 'bluebird';
import * as MediaWiki from './MediaWiki';
import {createServerData} from './Utils';
import logger from './Logger';
import localSettings from '../../config/localSettings';

/**
 * @todo XW-608 move setTitile to common part for CuratedMainPageRequestHelper and ArticleRequestHelper
 * Common part should be extracted and moved to new class WikiaRequestHelper(?)
 */

/**
 * @class ArticleRequestError
 */
export class ArticleRequestError {
	/**
	 * @param {ArticlePageData} data
	 * @returns {void}
	 */
	constructor(data) {
		Error.apply(this, arguments);
		this.data = data;
	}
}
ArticleRequestError.prototype = Object.create(Error.prototype);

/**
 * @class ArticleRequestHelper
 * @property {ArticleRequestParams} params
 */
export class ArticleRequestHelper {
	/**
	 * @param {ArticleRequestParams} params
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
	 * @returns {Promise<ArticlePageData>}
	 */
	getFull() {
		const requests = [
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
		return settle(requests)
			/**
			 * @param {Promise.Inspection<Promise<ArticlePageData>>[]} results
			 * @returns {void}
			 */
			.then((results) => {
				const articlePromise = results[0],
					wikiVariablesPromise = results[1],
					isArticlePromiseFulfilled = articlePromise.isFulfilled(),
					isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled();

				let article,
					wikiVariables,
					data;

				// if promise is fulfilled - use resolved value, if it's not - use rejection reason
				article = isArticlePromiseFulfilled ?
					articlePromise.value() :
					articlePromise.reason();

				wikiVariables = isWikiVariablesPromiseFulfilled ?
					wikiVariablesPromise.value() :
					wikiVariablesPromise.reason();

				if (!isWikiVariablesPromiseFulfilled || !wikiVariables) {
					return reject(new MediaWiki.WikiVariablesRequestError(wikiVariables));
				}

				data = {
					article,
					server: createServerData(localSettings, this.params.wikiDomain),
					wikiVariables
				};

				if (isArticlePromiseFulfilled && article) {
					return resolve(data);
				} else {
					// Even if article promise failed we want to display app using the rest of data
					return reject(new ArticleRequestError(data));
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
	getArticle() {
		const articleRequest = new MediaWiki.ArticleRequest(this.params);

		logger.debug(this.params, 'Fetching article');

		return articleRequest.article(this.params.title, this.params.redirect, this.params.sections);
	}

	/**
	 * @returns {Promise}
	 */
	getArticleRandomTitle() {
		const articleRequest = new MediaWiki.ArticleRequest(this.params);

		return articleRequest
			.randomTitle()
			/**
			 * @param {*} result
			 * @returns {Promise}
			 */
			.then((result) => {
				if (result.query && result.query.pages) {
					const articleId = Object.keys(result.query.pages)[0],
						pageData = result.query.pages[articleId];

					return resolve({
						title: pageData.title
					});
				} else {
					return reject(result.exception);
				}
			});
	}
}
