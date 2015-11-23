import * as Article from '../lib/Article';
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
 * @param {ArticleRequestHelper} article
 * @returns {void}
 */
function redirectToMainPage(reply, article) {
	article
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
			Logger.error('WikiVariables error', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {ArticlePageData} data
 * @param {boolean} [allowCache=true]
 * @param {number} [code=200]
 * @returns {void}
 */
function outputResponse(request, reply, data, allowCache = true, code = 200) {
	let result = prepareArticleData(request, data),
		response;

	// mainPageData is set only on curated main pages - only then we should do some special preparation for data
	if (data.article.data && data.article.data.isMainPage && data.article.data.mainPageData) {
		result = deepExtend(result, prepareMainPageData(data));
		delete result.adsContext;
		// @todo XW-596 we shouldn't rely on side effects of this function
		Tracking.handleResponseCuratedMainPage(result, request);
	} else {
		// @todo XW-596 we shouldn't rely on side effects of this function
		Tracking.handleResponse(result, request);
	}

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
 * @param {ArticleRequestHelper}article
 * @param {boolean} allowCache
 * @returns {void}
 */
function getArticle(request, reply, article, allowCache) {
	article
		.getFull()
		/**
		 * @param {ArticlePageData} data
		 * @returns {void}
		 */
		.then((data) => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			outputResponse(request, reply, data, allowCache);
		})
		/**
		 * @param {MWException} error
		 * @returns {void}
		 */
		.catch(WikiVariablesRequestError, (error) => {
			Logger.error('WikiVariables error', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch(Article.ArticleRequestError, (error) => {
			const data = error.data,
				errorCode = getStatusCode(data.article, 500);

			Logger.error('Article error', data.article.exception);

			// It's possible that the article promise is rejected but we still want to redirect to canonical host
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);

			// Clean up exception to not put its details in HTML response
			delete data.article.exception.details;

			outputResponse(request, reply, data, allowCache, errorCode);
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
			Logger.fatal('Unhandled error, code issue', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function showArticle(request, reply) {
	const path = request.path,
		wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			redirect: request.query.redirect
		};

	let article,
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

	article = new Article.ArticleRequestHelper(params);

	if (path === '/' || path === '/wiki/') {
		redirectToMainPage(reply, article);
	} else {
		article.setTitle(request.params.title);
		getArticle(request, reply, article, allowCache);
	}
}
