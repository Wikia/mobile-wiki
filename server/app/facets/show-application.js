import * as MW from '../lib/mediawiki';
import * as Utils from '../lib/utils';
import * as Tracking from '../lib/tracking';
import * as OpenGraph from '../lib/open-graph';
import Logger from '../lib/logger';
import localSettings from '../../config/localSettings';
import discussionsSplashPageConfig from '../../config/discussionsSplashPageConfig';
import {gaUserIdHash} from '../lib/hashing';
import {
	RedirectedToCanonicalHost, WikiVariablesNotValidWikiError, WikiVariablesRequestError
} from '../lib/custom-errors';
import {isRtl, getUserId, getLocalSettings} from './operations/page-data-helper';
import showServerErrorPage from './operations/show-server-error-page';

/**
 * @typedef {Object} CommunityAppConfig
 * @property {string} androidAppLink
 * @property {string} iosAppLink
 */

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {*} context
 * @returns {void}
 */
function outputResponse(request, reply, context) {
	Tracking.handleResponse(context, request);
	reply.view('application', context);
}

/**
 * @param {string} hostName
 * @returns {CommunityAppConfig}
 */
function getDistilledDiscussionsSplashPageConfig(hostName) {
	const mainConfig = discussionsSplashPageConfig[hostName];

	if (mainConfig) {
		return {
			androidAppLink: mainConfig.androidAppLink,
			iosAppLink: mainConfig.iosAppLink,
		};
	}
	return {};
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {object} wikiVariables
 * @returns {void}
 */
export default function showApplication(request, reply, wikiVariables) {
	const wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		context = {},
		hostName = Utils.getWikiaSubdomain(request.info.host);

	if (typeof wikiVariables === 'undefined') {
		wikiVariables = new MW.WikiRequest({wikiDomain}).wikiVariables();
	}

	// @todo These transforms could be better abstracted, as such, this is a lot like prepareArticleData
	context.server = Utils.createServerData(localSettings, wikiDomain);
	context.queryParams = Utils.parseQueryParams(request.query, []);
	context.localSettings = getLocalSettings();
	context.userId = getUserId(request);
	context.gaUserIdHash = gaUserIdHash(context.userId);
	context.discussionsSplashPageConfig = getDistilledDiscussionsSplashPageConfig(hostName);

	wikiVariables
		/**
		 * @param {*} wikiVariables
		 * @returns {Promise}
		 */
		.then((wikiVariables) => {
			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables);

			context.wikiVariables = wikiVariables;
			context.isRtl = isRtl(wikiVariables);

			return OpenGraph.getAttributes(request, context.wikiVariables);
		})
		/**
		 * @param {*} openGraphData
		 * @returns {void}
		 */
		.then((openGraphData) => {
			// Add OpenGraph attributes to context
			context.openGraph = openGraphData;
			outputResponse(request, reply, context);
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
