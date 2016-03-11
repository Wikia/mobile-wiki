import {PageRequest} from '../../lib/mediawiki';
import {getCachedWikiDomainName} from '../../lib/utils';
import localSettings from '../../../config/localSettings';
import getStatusCode from '../operations/get-status-code';

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	const params = {
		wikiDomain: getCachedWikiDomainName(localSettings, request),
		sectionName: decodeURIComponent(request.params.sectionName) || null
	};

	new PageRequest(params)
		.curatedContentSection(params.sectionName)
		.then(reply)
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply(error).code(getStatusCode(error));
		});
}
