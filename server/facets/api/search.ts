import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import getStatusCode = require('../operations/getStatusCode');

export function get(request: Hapi.Request, reply: any): void {
	var params = {
		wikiDomain: Utils.getCachedWikiDomainName(localSettings, request),
		query: request.params.query
	};

	new MW.SearchRequest({
			wikiDomain: params.wikiDomain
		})
		.searchForQuery(params.query)
		.then(reply)
		.catch((error: any): void => {
			reply(error).code(getStatusCode(error));
		});
}
