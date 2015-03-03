/// <reference path="../../../typings/hapi/hapi.d.ts" />

import MW = require('../../lib/MediaWiki');
import localSettings = require('../../../config/localSettings');
import Utils = require('../../lib/Utils');

function proxyMW (request: Hapi.Request, reply: any) {
	var path = request.path.substr(1),
		url = MW.createUrl(Utils.getCachedWikiDomainName(localSettings, request.headers.host), path);

	reply.proxy({
		uri: url,
		redirects: localSettings.proxyMaxRedirects
	});
};

export = proxyMW;
