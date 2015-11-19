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
};
