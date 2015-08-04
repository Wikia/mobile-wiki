/// <reference path='../lib/Utils.ts' />
/// <reference path='../lib/Tracking.ts' />
/// <reference path="../../typings/hapi/hapi.d.ts" />

import MW = require('../lib/MediaWiki');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import localSettings = require('../../config/localSettings');

function showApplication(request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		wikiVariables = new MW.WikiRequest({wikiDomain: wikiDomain}).getWikiVariables();

	wikiVariables.then((response) => {
		var result: any = {};

		// TODO: These transforms could be better abstracted, as such, this is a lot like prepareArticleData
		result.wiki = response.data;
		result.server = Utils.createServerData(localSettings, wikiDomain);
		result.queryParams = Utils.parseQueryParams(request.query, []);
		result.weppyConfig = localSettings.weppy;
		result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

		if (result.wiki.language) {
			var userDir = result.wiki.language.userDir;
			result.isRtl = (userDir === 'rtl');
		}

		// TODO: I'm not fond of there being several patterns for transforming the object here.
		Tracking.handleResponse(result, request);

		reply.view('application', result);
	});
}

export = showApplication;
