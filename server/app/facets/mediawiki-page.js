import {disableCache, setResponseCaching, Interval as CachingInterval, Policy as CachingPolicy} from '../lib/caching';
import {
	PageRequestError,
	RedirectedToCanonicalHost,
	WikiVariablesNotValidWikiError,
	WikiVariablesRequestError
} from '../lib/custom-errors';
import Logger from '../lib/logger';
import {
	namespace as MediaWikiNamespace,
	isContentNamespace as MediaWikiIsContentNamespace
} from '../lib/mediawiki-namespace';
import {PageRequestHelper} from '../lib/mediawiki-page';
import {
	getCachedWikiDomainName,
	redirectToCanonicalHostIfNeeded,
	redirectToOasis
} from '../lib/utils';
import * as Tracking from '../lib/tracking';
import getStatusCode from './operations/get-status-code';
import localSettings from '../../config/localSettings';
import prepareArticleData from './operations/prepare-article-data';
import prepareCategoryData from './operations/prepare-category-data';
import prepareMainPageData from './operations/prepare-main-page-data';
import prepareMediaWikiData from './operations/prepare-mediawiki-data';
import showServerErrorPage from './operations/show-server-error-page';
import deepExtend from 'deep-extend';
import getGlobalFooterData from '../lib/global-footer';

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
	let result = {},
		pageData = {},
		viewName = 'wiki-page',
		isMainPage = false,
		isContentNamespace,
		ns,
		response;

	if (data.page && data.page.data) {
		pageData = data.page.data;
		ns = pageData.ns;
		isMainPage = pageData.isMainPage;
	}

	result.mediaWikiNamespace = ns;
	result.articleId = pageData.details ? pageData.details.id : 0;

	isContentNamespace = MediaWikiIsContentNamespace(ns, data.wikiVariables.contentNamespaces);

	// pass page title to front
	result.urlTitleParam = request.params.title;

	// Main pages can live in namespaces which are not marked as content
	if (isContentNamespace || isMainPage) {
		viewName = 'article';
		result = deepExtend(result, prepareArticleData(request, data));
	} else if (ns === MediaWikiNamespace.CATEGORY) {
		if (pageData.article && pageData.details) {
			viewName = 'article';
			result = deepExtend(result, prepareArticleData(request, data));
		}
		result = deepExtend(result, prepareCategoryData(request, data));
	} else if (code !== 200) {
		// In case of status code different than 200 we want Ember to display an error page
		// This method sets all the data required to start the app
		result = prepareMediaWikiData(request, data);
	} else {
		Logger.info(`Unsupported namespace: ${ns}`);
		redirectToOasis(request, reply);
		return;
	}

	// mainPageData is set only on curated main pages - only then we should do some special preparation for data
	if (isMainPage && pageData.mainPageData) {
		result = deepExtend(result, prepareMainPageData(data));
	}

	// @todo XW-596 we shouldn't rely on side effects of this function
	Tracking.handleResponse(result, request);
	result.globalFooter = data.globalFooter;
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
		 * Get data for Global Footer
		 * @param {MediaWikiPageData} data
		 * @returns {MediaWikiPageData}
		 *
		 */
		.then((data) => {
			return getGlobalFooterData(data, request);
		})
		/**
		 * If both requests for Wiki Variables and for Page Details succeed
		 * @param {MediaWikiPageData} data
		 * @returns {void}
		 */
		.then((data) => {
			redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
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
			redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

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
		wikiDomain = getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			redirect: request.query.redirect
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

	if (path === '/' || path === '/wiki') {
		redirectToMainPage(reply, mediaWikiPageHelper);
	} else {
		mediaWikiPageHelper.setTitle(request.params.title);
		getMediaWikiPage(request, reply, mediaWikiPageHelper, allowCache);
	}
}
