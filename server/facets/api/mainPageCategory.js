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
		categoryName: decodeURIComponent(request.params.categoryName),
		thumbSize: request.params.thumbSize || {
			width: 300,
			height: 300
		},
		offset: request.query.offset || ''
	};

	new ArticleRequest(params)
		.category(params.categoryName, params.thumbSize, params.offset)
		.then(reply)
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply(error).code(getStatusCode(error));
		});
}
