/// <reference path='../lib/Utils.ts' />
/// <reference path='../lib/Tracking.ts' />
/// <reference path='../lib/OpenGraph.ts' />
/// <reference path="../../typings/hapi/hapi.d.ts" />

import MW = require('../lib/MediaWiki');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import OpenGraph = require('../lib/OpenGraph');
import localSettings = require('../../config/localSettings');

function showApplication (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		wikiVariables = new MW.WikiRequest({wikiDomain: wikiDomain}).getWikiVariables(),
		context: any = {};

	// TODO: These transforms could be better abstracted, as such, this is a lot like prepareArticleData
	context.server = Utils.createServerData(localSettings, wikiDomain);
	context.queryParams = Utils.parseQueryParams(request.query, []);
	context.weppyConfig = localSettings.weppy;
	context.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	wikiVariables.then((response) => {
		context.wiki = response.data;

		if (context.wiki.language) {
			var userDir = context.wiki.language.userDir;
			context.isRtl = (userDir === 'rtl');
		}

		return OpenGraph.getAttributes(request.path, request.params, context.wiki);
	}).then((openGraphData: any): void => {
		// Add OpenGraph attributes to context
		context.openGraph = openGraphData;

		outputResponse(request, reply, context);
	}).catch((): void => {
		// In case of any unforeseeable errors, attempt to output with the context we have so far
		outputResponse(request, reply, context);
	});
}

function outputResponse (request: Hapi.Request, reply: Hapi.Response, context: any): void {
	Tracking.handleResponse(context, request);
	reply.view('application', context);
}

export = showApplication;
