import {PageRequestHelper} from '../lib/mediawiki-page';
import {
	PageRequestError,
	RedirectedToCanonicalHost,
	WikiVariablesNotValidWikiError,
	WikiVariablesRequestError
} from '../lib/custom-errors';
import Logger from '../lib/logger';
import {namespace as MediaWikiNamespace} from '../lib/mediawiki';
import {disableCache, setResponseCaching, Interval as CachingInterval, Policy as CachingPolicy} from '../lib/caching';
import * as Tracking from '../lib/tracking';
import * as Utils from '../lib/utils';
import getStatusCode from './operations/get-status-code';
import localSettings from '../../config/localSettings';
import prepareArticleData from './operations/prepare-article-data';
import prepareCategoryData from './operations/prepare-category-data';
import prepareMainPageData from './operations/prepare-main-page-data';
import prepareMediaWikiData from './operations/prepare-mediawiki-data';
import showServerErrorPage from './operations/show-server-error-page';
import deepExtend from 'deep-extend';

const cachingTimes = {
	enabled: true,
	cachingPolicy: CachingPolicy.Public,
	varnishTTL: CachingInterval.standard,
	browserTTL: CachingInterval.disabled
};

/**
 * @typedef {Object} MediaWikiPageData
 * @param {number} ns
 * @param {Object} [article]
 */

/**
 * @param {Hapi.Response} reply
 * @param {PageRequestHelper} mediaWikiPageHelper
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
		 * If request for Wiki Variables fails
		 * @returns {void}
		 */
		.catch(WikiVariablesRequestError, () => {
			showServerErrorPage(reply);
		})
		/**
		 * If request for Wiki Variables succeeds, but wiki does not exist
		 * @returns {void}
		 */
		.catch(WikiVariablesNotValidWikiError, () => {
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.fatal(error, 'Unhandled error, code issue');
			showServerErrorPage(reply);
		});
}

/**
 * Handles getPage response from API
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {MediaWikiPageData} data
 * @param {boolean} [allowCache=true]
 * @param {number} [code=200]
 * @returns {void}
 */
function handleResponse(request, reply, data, allowCache = true, code = 200) {
	const i18n = request.server.methods.i18n.getInstance();

	let result = {},
		pageData = {},
		viewName = 'wiki-page',
		response,
		ns;

	if (data.page && data.page.data) {
		pageData = data.page.data;
		ns = pageData.ns;
		result.mediaWikiNamespace = ns;
	}
	// pass page title to front
	result.urlTitleParam = request.params.title;

	switch (ns) {
		case MediaWikiNamespace.MAIN:
			viewName = 'article';
			result = deepExtend(result, prepareArticleData(request, data));

			break;

		case MediaWikiNamespace.CATEGORY:
			if (pageData.article && pageData.details) {
				viewName = 'article';
				result = deepExtend(result, prepareArticleData(request, data));
			}

			result = deepExtend(result, prepareCategoryData(request, data));
			// Hide TOC on category pages
			result.hasToC = false;
			result.subtitle = i18n.t('app.category-page-subtitle');
			break;

		default:
			Logger.warn(`Unsupported namespace: ${ns}`);
			result = prepareMediaWikiData(request, data);
	}

	// mainPageData is set only on curated main pages - only then we should do some special preparation for data
	if (pageData.isMainPage && pageData.mainPageData) {
		result = deepExtend(result, prepareMainPageData(data));
		result.hasToC = false;
		delete result.adsContext;
	}

	// @todo XW-596 we shouldn't rely on side effects of this function
	Tracking.handleResponse(result, request);

	response = reply.view(viewName, result);
	response.code(code);
	response.type('text/html; charset=utf-8');

	if (allowCache) {
		setResponseCaching(response, cachingTimes);
	} else {
		disableCache(response);
	}
}

/**
 * Gets wiki variables and wiki page, handles errors on both promises
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
		 * If both requests for Wiki Variables and for Page Details succeed
		 * @param {MediaWikiPageData} data
		 * @returns {void}
		 */
		.then((data) => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			handleResponse(request, reply, data, allowCache);
		})
		/**
		 * If request for Wiki Variables fails
		 * @returns {void}
		 */
		.catch(WikiVariablesRequestError, () => {
			showServerErrorPage(reply);
		})
		/**
		 * If request for Wiki Variables succeeds, but wiki does not exist
		 * @returns {void}
		 */
		.catch(WikiVariablesNotValidWikiError, () => {
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		/**
		 * If request for Wiki Variables succeeds, but request for Page Details fails
		 * @param {*} error
		 * @returns {void}
		 */
		.catch(PageRequestError, (error) => {
			const data = error.data,
				errorCode = getStatusCode(data.page, 500);

			// It's possible that the article promise is rejected but we still want to redirect to canonical host
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

			// Clean up exception to not put its details in HTML response
			delete data.page.exception.details;

			handleResponse(request, reply, data, allowCache, errorCode);
		})
		/**
		 * @returns {void}
		 */
		.catch(RedirectedToCanonicalHost, () => {
			Logger.info('Redirected to canonical host');
		})
		/**
		 * Other errors
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.fatal(error, 'Unhandled error, code issue');
			showServerErrorPage(reply);
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

	if (path === '/' || path === '/wiki') {
		redirectToMainPage(reply, mediaWikiPageHelper);
	} else {
		mediaWikiPageHelper.setTitle(request.params.title);
		getMediaWikiPage(request, reply, mediaWikiPageHelper, allowCache);
	}
}
