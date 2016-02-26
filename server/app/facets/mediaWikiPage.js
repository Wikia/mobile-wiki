import {PageRequestHelper, PageRequestError} from '../lib/MediaWikiPage';
import {WikiVariablesRequestError, namespace as MediaWikiNamespace} from '../lib/MediaWiki';
import setResponseCaching, * as Caching from '../lib/Caching';
import Logger from '../lib/Logger';
import * as Tracking from '../lib/Tracking';
import * as Utils from '../lib/Utils';
import getStatusCode from './operations/getStatusCode';
import localSettings from '../../config/localSettings';
import prepareArticleData from './operations/prepareArticleData';
import prepareMainPageData from './operations/prepareMainPageData';
import prepareMediaWikiData from './operations/prepareMediaWikiData';
import deepExtend from 'deep-extend';

const cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

/**
 * @typedef {Object} MediaWikiPageData
 * @param {number} ns
 * @param {Object} [article]
 */

/**
 * This is used only locally, normally MediaWiki takes care of this redirect
 * Production traffic should not reach this place
 * although if it does it guarantees graceful fallback.
 *
 * @param {Hapi.Response} reply
 * @param {RequestHelper} mediaWikiPageHelper
 * @returns {void}
 */
function redirectToMainPage(reply, mediaWikiPageHelper) {
	mediaWikiPageHelper
		.getWikiVariables()
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((wikiVariables) => {
			Logger.info('Redirected to main page');
			reply.redirect(wikiVariables.articlePath + encodeURIComponent(wikiVariables.mainPageTitle));
		})
		/**
		 * @param {MWException} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.error(error, 'WikiVariables error');
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {MediaWikiPageData} data
 * @param {boolean} [allowCache=true]
 * @param {number} [code=200]
 * @returns {void}
 */
function handleResponse(request, reply, data, allowCache = true, code = 200) {
	let result = {}, response, ns;

	if (data.page && data.page.data) {
		ns = data.page.data.ns;
		result.mediaWikiNamespace = ns;
	}

	switch (ns) {
		case MediaWikiNamespace.MAIN:
			result = deepExtend(result, prepareArticleData(request, data));

			// mainPageData is set only on curated main pages - only then we should do some special preparation for data
			if (data.page.data && data.page.data.isMainPage && data.page.data.mainPageData) {
				result = deepExtend(result, prepareMainPageData(data));
				delete result.adsContext;
			}
			break;

		default:
			Logger.info(`Unsupported namespace: ${ns}`);
			result = prepareMediaWikiData(request, data);
	}

	// @todo XW-596 we shouldn't rely on side effects of this function
	Tracking.handleResponse(result, request);

	response = reply.view('article', result);
	response.code(code);
	response.type('text/html; charset=utf-8');

	if (allowCache) {
		return setResponseCaching(response, cachingTimes);
	}

	return Caching.disableCache(response);
}

/**
 * Gets wiki variables and article, handles errors on both promises
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {PageRequestHelper} mediaWikiPageHelper
 * @param {boolean} allowCache
 * @returns {void}
 */
function getMediaWikiPage(request, reply, mediaWikiPageHelper, allowCache) {
	mediaWikiPageHelper
		.getFull()
		/**
		 * @param {MediaWikiPageData} data
		 * @returns {void}
		 */
		.then((data) => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			handleResponse(request, reply, data, allowCache);
		})
		/**
		 * @param {MWException} error
		 * @returns {void}
		 */
		.catch(WikiVariablesRequestError, (error) => {
			Logger.error(error, 'WikiVariables error');
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch(PageRequestError, (error) => {
			const data = error.data,
				errorCode = getStatusCode(data.page, 500);

			Logger.error(data.page.exception, 'MediaWikiPage error');

			// It's possible that the article promise is rejected but we still want to redirect to canonical host
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

			// Clean up exception to not put its details in HTML response
			delete data.page.exception.details;

			handleResponse(request, reply, data, allowCache, errorCode);
		})
		/**
		 * @returns {void}
		 */
		.catch(Utils.RedirectedToCanonicalHost, () => {
			Logger.info('Redirected to canonical host');
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.fatal(error, 'Unhandled error, code issue');
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function mediaWikiPageHandler(request, reply) {
	const path = request.path,
		wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			redirect: request.query.redirect
		};

	let mediaWikiPageHelper,
		allowCache = true;

	// @todo This is really only a temporary check while we see if loading a smaller
	// article has any noticable effect on engagement
	if (Utils.shouldAsyncArticle(localSettings, request.headers.host)) {
		// Only request an adequate # of sessions to populate above the fold
		params.sections = '0,1,2';
	}

	if (request.state.wikicities_session) {
		params.headers = {
			Cookie: `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	mediaWikiPageHelper = new PageRequestHelper(params);

	if (path === '/' || path === '/wiki/') {
		redirectToMainPage(reply, mediaWikiPageHelper);
	} else {
		mediaWikiPageHelper.setTitle(request.params.title);
		getMediaWikiPage(request, reply, mediaWikiPageHelper, allowCache);
	}
}
