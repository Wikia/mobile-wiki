import {WikiRequest} from '../lib/MediaWiki';
import {getCachedWikiDomainName}  from '../lib/Utils';
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
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		wikiVariables = new WikiRequest({wikiDomain}).wikiVariables();

	wikiVariables.then((variables) => {
		if (!variables.enableDiscussions) {
			return reply('Not Found').code(404);
		}

		showApplication(request, reply, wikiVariables);
	});
}
