import * as MW from '../lib/mediawiki';
import * as Utils from '../lib/utils';
import * as Tracking from '../lib/tracking';
import Promise from 'bluebird';
import Logger from '../lib/logger';
import settings from '../../config/settings';
import {gaUserIdHash} from '../lib/hashing';
import {
	RedirectedToCanonicalHost, NonJsonApiResponseError, WikiVariablesRequestError
} from '../lib/custom-errors';
import {isRtl, getUserId, getSettings} from './operations/page-data-helper';
import showServerErrorPage from './operations/show-server-error-page';
import injectDesignSystemData from '../lib/inject-design-system-data';

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
	Utils.setI18nLang(request, context.wikiVariables).then(() => {
		reply.view('application', context);
	});
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @param {Promise} wikiVariables
 * @param {Object} context
 * @param {Boolean} showGlobalFooter
 * @returns {void}
 */
export default function showApplication(request, reply, wikiVariables, context = {}, showGlobalFooter = false) {
	const wikiDomain = Utils.getCachedWikiDomainName(settings, request);

	if (!(wikiVariables instanceof Promise)) {
		wikiVariables = new MW.WikiRequest({wikiDomain}).wikiVariables();
	}

	// @todo These transforms could be better abstracted, as such, this is a lot like prepareWikiPageData
	context.server = Utils.createServerData(settings, wikiDomain);
	context.queryParams = Utils.parseQueryParams(request.query, []);
	context.settings = getSettings();
	context.userId = getUserId(request);
	context.gaUserIdHash = gaUserIdHash(context.userId);

	wikiVariables
		/**
		 * @param {*} wikiVariables
		 * @returns {Promise}
		 */
		.then((wikiVariables) => {
			Utils.redirectToCanonicalHostIfNeeded(settings, request, reply, wikiVariables);

			context.wikiVariables = wikiVariables;
			context.isRtl = isRtl(wikiVariables);

			return context;
		})
		/**
		 * Get data for Global Footer
		 * @param {MediaWikiPageData} templateData
		 * @returns {MediaWikiPageData}
		 *
		 */
		.then((templateData) => injectDesignSystemData({
			data: templateData,
			request,
			showFooter: showGlobalFooter
		}))
		/**
		 * @param {*} contextData
		 * @returns {void}
		 */
		.then((templateData) => {
			outputResponse(request, reply, templateData);
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
		.catch(NonJsonApiResponseError, (err) => {
			reply.redirect(err.redirectLocation);
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
