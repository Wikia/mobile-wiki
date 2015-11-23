import * as MW from '../../lib/MediaWiki';
import * as Utils from '../../lib/Utils';
import localSettings from '../../../config/localSettings';
import getStatusCode from '../operations/getStatusCode';

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export function get(request, reply) {
	const params = {
		wikiDomain: Utils.getCachedWikiDomainName(localSettings, request),
		sectionName: decodeURIComponent(request.params.sectionName) || null
	};

	new MW.ArticleRequest(params)
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
