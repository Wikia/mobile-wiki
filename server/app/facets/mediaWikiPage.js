import * as MediaWikiPage from '../lib/MediaWikiPage';
import {WikiVariablesRequestError} from '../lib/MediaWiki';
import setResponseCaching, * as Caching from '../lib/Caching';
import Logger from '../lib/Logger';
import * as Tracking from '../lib/Tracking';
import * as Utils from '../lib/Utils';
import getStatusCode from './operations/getStatusCode';
import localSettings from '../../config/localSettings';
import prepareArticleData from './operations/prepareArticleData';
import prepareMainPageData from './operations/prepareMainPageData';
import deepExtend from 'deep-extend';

const cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

/**
 * This is used only locally, normally MediaWiki takes care of this redirect
 *
 * @param {Hapi.Response} reply
 * @param {MediaWikiPageRequestHelper} mediaWikiPageHelper
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
	let result, response;

	switch (data.type) {
		case 'article':
			result = prepareArticleData(request, data);
			result.mediaWikiPageType = 'article';
			break;
		case 'main-page':
			// mainPageData is set only on curated main pages - only then we should do some special preparation for data
			if (data.article.data && data.article.data.isMainPage && data.article.data.mainPageData) {
				result = deepExtend(prepareArticleData(request, data), prepareMainPageData(data));
				result.mediaWikiPageType = 'main-page';
				delete result.adsContext;
			} else {
				// main page, but no extra data - it's an article
				result = prepareArticleData(request, data);
				result.mediaWikiPageType = 'article';
			}
			break;
		default:
			// unsupported page type
			// prepare article data, so we won't blow
			result = prepareArticleData(request, data);
			result.mediaWikiPageType = data.type;
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
 * @param {MediaWikiPageRequestHelper} mediaWikiPageHelper
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
		.catch(MediaWikiPage.MediaWikiPageRequestError, (error) => {
			const data = error.data,
				errorCode = getStatusCode(data.article, 500);

			Logger.error(data.article.exception, 'MediaWikiPage error');

			// It's possible that the article promise is rejected but we still want to redirect to canonical host
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

			// Clean up exception to not put its details in HTML response
			delete data.article.exception.details;

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

	mediaWikiPageHelper = new MediaWikiPage.MediaWikiPageRequestHelper(params);

	if (path === '/' || path === '/wiki/') {
		redirectToMainPage(reply, mediaWikiPageHelper);
	} else {
		mediaWikiPageHelper.setTitle(request.params.title);
		getMediaWikiPage(request, reply, mediaWikiPageHelper, allowCache);
	}
}
