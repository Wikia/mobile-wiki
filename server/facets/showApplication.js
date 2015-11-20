/**
 * @typedef {Object} CommunityAppConfig
 * @property {string} androidAppLink
 * @property {string} iosAppLink
 */

const MW = require('../lib/MediaWiki'),
	Utils = require('../lib/Utils'),
	Tracking = require('../lib/Tracking'),
	OpenGraph = require('../lib/OpenGraph'),
	Logger = require('../lib/Logger'),
	localSettings = require('../../config/localSettings'),
	discussionsSplashPageConfig = require('../../config/discussionsSplashPageConfig');

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
 * @returns {void}
 */
exports.showApplication = function (request, reply) {
	const wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		wikiVariables = new MW.WikiRequest({wikiDomain}).wikiVariables(),
		context = {},
		hostName = Utils.getWikiaSubdomain(request.info.host);

	// @todo These transforms could be better abstracted, as such, this is a lot like prepareArticleData
	context.server = Utils.createServerData(localSettings, wikiDomain);
	context.queryParams = Utils.parseQueryParams(request.query, []);
	context.localSettings = localSettings;
	context.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;
	context.discussionsSplashPageConfig = getDistilledDiscussionsSplashPageConfig(hostName);

	wikiVariables
		/**
		 * @param {*} wikiVariables
		 * @returns {Promise}
		 */
		.then((wikiVariables) => {
			let contentDir,
				displayTitle;

			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables);

			context.wikiVariables = wikiVariables;
			if (context.wikiVariables.language) {
				contentDir = context.wikiVariables.language.contentDir;
				context.isRtl = (contentDir === 'rtl');
			}

			// @todo Update displayTitle
			displayTitle = '';
			context.htmlTitle = Utils.getHtmlTitle(wikiVariables, displayTitle);

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
			// `error` could be an object or a string here
			Logger.warn({error}, 'Failed to get complete app view context');
			// In case of any unforeseeable error, attempt to output with the context we have so far
			outputResponse(request, reply, context);
		});
};
