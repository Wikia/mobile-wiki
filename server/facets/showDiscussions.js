import config from '../../config/discussionsSplashPageConfig';
import {getWikiaSubdomain} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import showApplication from '../facets/showApplication';

/**
 * Obtains discussions config for a community
 *
 * @param {string} host
 * @returns {WikiaDiscussionsConfig}
 */
function getConfigFromUrl(host) {
	const domain = getWikiaSubdomain(host);

	return config[domain];
}

/**
 * Generates and shows splash page from config
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @param {WikiaDiscussionsConfig} discussionsConfig
 * @returns {Hapi.Response}
 */
function showSplashPage(request, reply, discussionsConfig) {
	request.server.methods.i18n.getInstance().setLng(discussionsConfig.language);

	return reply.view(
		'discussions/landing-page',
		{
			canonicalUrl: `http://${request.headers.host}${request.path}`,
			discussionsConfig,
			language: request.server.methods.i18n.getInstance().lng(),
			mainPage: 'http://www.wikia.com',
			wikiaUrl: `http://${discussionsConfig.domain}`,
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
}

/**
 * Renders either discussions or splash page depending on the config
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function showDiscussions(request, reply) {
	const discussionsConfig = getConfigFromUrl(request.headers.host);

	if (!discussionsConfig) {
		return reply('Not Found').code(404);
	}

	if (localSettings.enableDiscussions) {
		showApplication(request, reply);
	} else {
		showSplashPage(request, reply, discussionsConfig);
	}
}
