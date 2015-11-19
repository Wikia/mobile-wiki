const MW = require('../../lib/MediaWiki'),
	Utils = require('../../lib/Utils'),
	localSettings = require('../../../config/localSettings'),
	getStatusCode = require('../operations/getStatusCode');

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
exports.get = function (request, reply) {
	const params = {
		wikiDomain: Utils.getCachedWikiDomainName(localSettings, request),
		query: request.params.query
	};

	new MW.SearchRequest({wikiDomain: params.wikiDomain})
		.searchForQuery(params.query)
		.then(reply)
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply(error).code(getStatusCode(error));
		});
};
