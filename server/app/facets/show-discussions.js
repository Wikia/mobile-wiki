import {reject, settle} from 'bluebird';
import * as MediaWiki from '../lib/mediawiki';
import {getCachedWikiDomainName, getCorporatePageUrlFromWikiDomain} from '../lib/utils';
import localSettings from '../../config/localSettings';
import logger from '../lib/logger';
import showApplication from './show-application';

/**
 * Renders discussions page
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function showDiscussions(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		context = {},
		requests = [
			new MediaWiki.WikiRequest({wikiDomain}).wikiVariables(),
			new MediaWiki.DesignSystemRequest({corporatePageUrl: getCorporatePageUrlFromWikiDomain(wikiDomain)}).getFooter()
		];

	logger.debug('Fetching wiki variables and GlobalFooter data');

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
	settle(requests)
	/**
	 * @param {Promise.Inspection<Promise<MediaWikiPageData>>[]} results
	 * @returns {void}
	 */
		.then((results) => {
			const wikiVariablesPromise = results[0],
				globalFooterPromise = results[1],
				isWikiVariablesPromiseFulfilled = wikiVariablesPromise.isFulfilled(),
				isGlobalFooterPromiseFulfilled = globalFooterPromise.isFulfilled(),
				variables = wikiVariablesPromise.value();

			if (!isWikiVariablesPromiseFulfilled) {
				return reject(wikiVariablesPromise.reason());
			}

			if (!variables.enableDiscussions) {
				return reply('Not Found').code(404);
			}

			context.documentTitle = `Discussions - ${variables.siteName} - Wikia`;

			context.globalFooter = isGlobalFooterPromiseFulfilled ? globalFooterPromise.value() : {};
			context.globalFooter.isVisible = true;

			showApplication(request, reply, undefined, context);
		});
}
