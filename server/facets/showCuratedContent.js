import Logger from '../lib/Logger';
import {CuratedMainPageRequestHelper, MainPageDataRequestError} from '../lib/CuratedMainPage';
import * as MediaWiki from '../lib/MediaWiki';
import {getCachedWikiDomainName,
		redirectToCanonicalHostIfNeeded,
		RedirectedToCanonicalHost} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import prepareCuratedContentData from './operations/prepareCuratedContentData';
import setResponseCaching, * as Caching from '../lib/Caching';
import {handleResponseCuratedMainPage} from '../lib/Tracking';

const cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {ArticlePageData} data
 * @param {boolean} [allowCache=true]
 * @param {number} [code=200]
 *
 * @returns {void}
 */
function outputResponse(request, reply, data, allowCache = true, code = 200) {
	const result = prepareCuratedContentData(request, data);

	let response;

	// @todo XW-596 we shouldn't rely on side effects of this function
	handleResponseCuratedMainPage(result, request);

	response = reply.view('application', result);
	response.code(code);
	response.type('text/html; charset=utf-8');

	if (allowCache) {
		return setResponseCaching(response, cachingTimes);
	}

	return Caching.disableCache(response);
}

/**
 *
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function showCuratedContent(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		params = {wikiDomain};

	let mainPage,
		allowCache = true;

	if (request.state.wikicities_session) {
		params.headers = {
			Cookie: `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	mainPage = new CuratedMainPageRequestHelper(params);

	mainPage.setTitle(request.params.title);
	mainPage.getWikiVariablesAndDetails()
		/**
		 * @param {CuratedContentPageData} data
		 * @returns {void}
		 */
		.then((data) => {
			redirectToCanonicalHostIfNeeded(localSettings, request, reply, data.wikiVariables);
			outputResponse(request, reply, data, allowCache);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch(MainPageDataRequestError, (error) => {
			Logger.error('Error when fetching ads context and article details', error.data.exception);
			outputResponse(request, reply, error.data, false);
		})
		/**
		 * @param {MWException} error
		 * @returns {void}
		 */
		.catch(MediaWiki.WikiVariablesRequestError, (error) => {
			Logger.error('Error when fetching wiki variables', error);
			reply.redirect(localSettings.redirectUrlOnNoData);
		})
		/**
		 * @returns {void}
		 */
		.catch(RedirectedToCanonicalHost, () => {
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
