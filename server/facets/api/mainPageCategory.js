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
		categoryName: decodeURIComponent(request.params.categoryName),
		thumbSize: request.params.thumbSize || {
			width: 300,
			height: 300
		},
		offset: request.query.offset || ''
	};

	new MW.ArticleRequest(params)
		.category(params.categoryName, params.thumbSize, params.offset)
		.then(reply)
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply(error).code(getStatusCode(error));
		});
};
