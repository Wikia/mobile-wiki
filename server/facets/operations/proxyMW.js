const MW = require('../../lib/MediaWiki'),
	localSettings = require('../../../config/localSettings'),
	Utils = require('../../lib/Utils');

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
exports.proxyMW = function (request, reply) {
	const path = request.path.substr(1),
		url = MW.createUrl(Utils.getCachedWikiDomainName(localSettings, request), path);

	reply.proxy({
		uri: url,
		redirects: localSettings.proxyMaxRedirects
	});
};
