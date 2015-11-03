var config = <DiscussionsSplashPageConfig> require('../../../config/discussionsSplashPageConfig');
import Utils = require('../lib/Utils');
import localSettings = require('../../config/localSettings');
import showApplication = require('../facets/showApplication');

/**
 * Obtains discussions config for a community
 * @param {string} host
 * @returns {object}
 */
function getConfigFromUrl(host: string): WikiaDiscussionsConfig {
	var domain: string;

	domain = Utils.getWikiaSubdomain(host);

	return config[domain];
}

/**
 * Generates and shows splash page from config
 * @param {object} request
 * @param {object} reply
 * @param {object} discussionsConfig
 * @returns {object}
 */
function renderSplashPage (request: Hapi.Request, reply: any, discussionsConfig: WikiaDiscussionsConfig): Hapi.Response {
	var response: Hapi.Response, discussionsConfig: WikiaDiscussionsConfig;

	request.server.methods.i18n.getInstance().setLng(discussionsConfig.language);

	response = reply.view(
		'discussions/landing-page',
		{
			canonicalUrl: 'http://' + request.headers.host + request.path,
			discussionsConfig: discussionsConfig,
			language: request.server.methods.i18n.getInstance().lng(),
			mainPage: 'http://www.wikia.com',
			wikiaUrl: 'http://' + discussionsConfig.domain,
			trackingConfig: localSettings.tracking,
			pageParams: {
				language: discussionsConfig.language,
				wikiId: discussionsConfig.wikiId,
				dbName: discussionsConfig.dbName
			}
		},
		{
			layout: 'discussions'
		}
	);

	return response;
}

/**
 * Renders either discussions or splash page depending on the config
 * @param {object} request
 * @param {object} reply
 * @returns {void}
 */
function showDiscussions (request: Hapi.Request, reply: any): void {
	var discussionsConfig = getConfigFromUrl(request.headers.host);

	if (!discussionsConfig) {
		return reply('Not Found').code(404);
	}

	if (localSettings.enableDiscussions) {
		showApplication(request, reply);
	} else {
		renderSplashPage(request, reply, discussionsConfig);
	}
}

export = showDiscussions;
