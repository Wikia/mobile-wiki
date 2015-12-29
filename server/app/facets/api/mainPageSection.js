import {ArticleRequest} from '../../lib/MediaWiki';
import {getCachedWikiDomainName} from '../../lib/Utils';
import localSettings from '../../../config/localSettings';
import getStatusCode from '../operations/getStatusCode';

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

	new ArticleRequest(params)
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
