import * as MW from '../lib/MediaWiki';
import * as Utils from '../lib/Utils';
import localSettings from '../../config/localSettings';
import showApplication from '../facets/showApplication';

/**
 * Renders either discussions or splash page depending on the config
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function showDiscussions(request, reply) {
	const wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		wikiVariables = new MW.WikiRequest({wikiDomain}).wikiVariables();

	wikiVariables.then((variables) => {
		if (!variables.enableDiscussions) {
			return reply('Not Found').code(404);
		}

		showApplication(request, reply, wikiVariables);
	});
}
