import {PageRequestHelper} from '../../lib/mediawiki-page';
import {disableCache, setResponseCaching, Interval as CachingInterval, Policy as CachingPolicy} from '../../lib/caching';
import {getCachedWikiDomainName} from '../../lib/utils';
import localSettings from '../../../config/localSettings';
import getStatusCode from '../operations/get-status-code';

const cachingTimes = {
	enabled: true,
	cachingPolicy: CachingPolicy.Public,
	varnishTTL: CachingInterval.standard,
	browserTTL: CachingInterval.disabled
};

/**
 * @param {*} query
 * @returns {boolean}
 */
function isRequestForRandomTitle(query) {
	return (typeof query.random !== 'undefined' && typeof query.titleOnly !== 'undefined');
}

/**
 * @param {*} reply
 * @param {*} result
 * @param {boolean} allowCache
 * @returns {void}
 */
function handleArticleResponse(reply, result, allowCache) {
	const response = reply(result).code(getStatusCode(result));

	if (allowCache) {
		setResponseCaching(response, cachingTimes);
	} else {
		disableCache(response);
	}
}

/**
 * Entry point method for getting article API data, a HapiRouteHandler
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			title: request.params.articleTitle,
			redirect: request.params.redirect
		};

	let mediaWikiPageHelper,
		allowCache = true;

	if (request.state.wikicities_session) {
		params.headers = {
			Cookie: `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	mediaWikiPageHelper = new PageRequestHelper(params);

	if (isRequestForRandomTitle(request.query)) {
		mediaWikiPageHelper
			.getArticleRandomTitle()
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.then((result) => {
				disableCache(reply(result));
			})
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.catch((result) => {
				disableCache(reply(result).code(getStatusCode(result)));
			});
	} else {
		mediaWikiPageHelper
			.getArticle()
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.then((result) => {
				handleArticleResponse(reply, result, allowCache);
			})
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.catch((result) => {
				// We already have the logic to handle rejected promise in handleArticleResponse
				handleArticleResponse(reply, result, allowCache);
			});
	}
}
